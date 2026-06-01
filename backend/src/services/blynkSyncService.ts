import axios from "axios";
import { pool } from "../config/database";

// para testar a comunicação com o Blynk
export const testarConexaoBlynk = async (tokenBlynk: string) => {
    try {
        console.log(`[BLYNK TESTE] Buscando dados no Blynk para o token: ${tokenBlynk}`);

        const url = `https://blynk.cloud/external/api/get?token=${tokenBlynk}&v3&v4&v5&v6`;

        // O timeout evita que o backend fique travado
        const response = await axios.get(url, { timeout: 5000 });
        const dados = response.data;

        //  imprimir os dados no console para validar se estão chegando certo
        console.log("[BLYNK TESTE] Resposta recebida com sucesso!");
        console.log(`- Temperatura (V3):  ${dados.v3}`);
        console.log(`- Umidade (V4):      ${dados.v4}`);
        console.log(`- Luminosidade (V5): ${dados.v5}`);
        console.log(`- Distância (V6):    ${dados.v6}`);

        return response.data;
    } catch (erro: any) {
        console.error("[BLYNK TESTE] Falha ao comunicar com a API do Blynk:", erro.message);
        return null;
    }
};

// Relaciona o pino que vem do Blynk com o nome do sensor cadastrado na tabela
const MAPA_PINOS: Record<string, string> = {
  v3: "temperatura",
  v4: "umidade",
  v5: "luminosidade",
  v6: "movimento", // Mapeado para 'movimento' respeitando o banco de dados atual
};

// Vai no Blynk, busca os pinos e salva as variações na tabela leituras
export const sincronizarBlynkPorToken = async (tokenBlynk: string) => {
  const dadosBlynk = await testarConexaoBlynk(tokenBlynk);
  
  if (!dadosBlynk) {
    try {
      // Atualiza status para offline se a API do Blynk falhar (Timeout ou Erro)
      await pool.query(
        `UPDATE dispositivos SET status_dispositivo = 'offline' WHERE token_dispositivo = $1`,
        [tokenBlynk]
      );
      console.log(`[BLYNK SYNC] Dispositivo com token ${tokenBlynk} marcado como OFFLINE.`);
    } catch (err: any) {
      console.error("[BLYNK SYNC] Erro ao atualizar status para offline:", err.message);
    }
    return null;
  }

  try {
    // Descobre qual dispositivo do banco é dono deste token
    const { rows: dispositivos } = await pool.query(
      `SELECT id_dispositivo FROM dispositivos WHERE token_dispositivo = $1 AND ativo = true`,
      [tokenBlynk]
    );

    if (dispositivos.length === 0) {
      console.warn(`[BLYNK SYNC] Aviso: Nenhum dispositivo ativo cadastrado com o token: ${tokenBlynk}`);
      return dadosBlynk; // Retorna para exibir na tela de teste, mas não salva no BD
    }

    const id_dispositivo = dispositivos[0].id_dispositivo;

    // Atualiza status para online pois a comunicação foi bem-sucedida
    await pool.query(
      `UPDATE dispositivos SET status_dispositivo = 'online' WHERE id_dispositivo = $1`,
      [id_dispositivo]
    );

    // Pega todos os sensores atrelados a este dispositivo
    const { rows: sensores } = await pool.query(
      `SELECT id_sensor, tipo_sensor FROM sensores WHERE id_dispositivo = $1`,
      [id_dispositivo]
    );

    // Passa por cada valor recebido da API (ex: v3, v4)
    for (const [pino, valorString] of Object.entries(dadosBlynk)) {
      const tipoEsperado = MAPA_PINOS[pino.toLowerCase()];
      if (!tipoEsperado) continue;

      const sensor = sensores.find((s) => s.tipo_sensor === tipoEsperado);
      if (sensor) {
        const valorNumerico = parseFloat(valorString as string);
        
        // Trava de segurança: se o Blynk mandar lixo, não quebra a coluna NUMERIC do Postgres
        if (isNaN(valorNumerico)) {
          console.warn(`[BLYNK SYNC] Valor inválido recebido para o pino ${pino}: ${valorString}`);
          continue;
        }

        // Preserva o dado bruto (distância) e gera o booleano (movimento)
        let flagMovimento: boolean | null = null;

        if (tipoEsperado === "movimento") {
          // Limiar de 50cm: Obstáculos a menos de 50cm indicam presença/movimentação no berço
          const LIMIAR_BERCO_CM = 50.0;
          flagMovimento = valorNumerico < LIMIAR_BERCO_CM;
        }

        // O INSERT preenche ambas as colunas. Para temperatura/umidade, flagMovimento será nulo.
        await pool.query(
          `INSERT INTO leituras (id_sensor, valor, movimento) VALUES ($1, $2, $3)`,
          [sensor.id_sensor, valorNumerico, flagMovimento]
        );
        console.log(`[BLYNK DB] Leitura gravada -> Sensor: ${tipoEsperado} | Valor: ${valorNumerico} | Movimento: ${flagMovimento}`);
      }
    }
  } catch (error: any) {
    console.error("[BLYNK DB] Erro ao salvar dados no PostgreSQL:", error.message);
  }

  return dadosBlynk;
};

// Função para buscar todos os dispositivos ativos e sincronizar
export const sincronizarTodosDispositivos = async () => {
  try {
    const { rows: dispositivos } = await pool.query(
      `SELECT token_dispositivo FROM dispositivos WHERE ativo = true AND token_dispositivo IS NOT NULL AND token_dispositivo != '' AND token_dispositivo != 'null'`
    );

    if (dispositivos.length === 0) {
      return; //  para não poluir os logs quando não há robôs
    }

    for (const dispositivo of dispositivos) {
      await sincronizarBlynkPorToken(dispositivo.token_dispositivo);
    }
  } catch (error: any) {
    console.error("[WORKER BLYNK] Erro no ciclo de sincronização:", error.message);
  }
};

// Orquestrador de Sincronização Automática (Loop de 60s)
export const iniciarSincronizacaoAutomatica = async () => {
  const INTERVALO_MS = 60000; // 60 segundos
  try {
    await sincronizarTodosDispositivos();
  } finally {
    // Usa setTimeout recursivo para evitar concorrência e sobreposição
    setTimeout(iniciarSincronizacaoAutomatica, INTERVALO_MS);
  }
};
