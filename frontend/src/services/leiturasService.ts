// logica das leituras

import * as LeituraRepository from '../repositories/LeituraRepository';
import * as EventoRepository from '../repositories/EventoRepository';
import { executeSelect, executeUpdate } from '../database/sqlite';
import { Leitura, CreateLeituraInput, UpdateLeituraInput } from '../models/Leitura';

export async function listarTodas(): Promise<Leitura[]> {
  try {
    console.log('[SERVICE] leiturasService.listarTodas()');

    return await LeituraRepository.getAllLeituras();
  } catch (error) {
    console.error('[SERVICE] Erro em listarTodas:', error);
    throw error;
  }
}

export async function listarPorSensor(id_sensor: number): Promise<Leitura[]> {
  try {
    console.log(`[SERVICE] leiturasService.listarPorSensor(${id_sensor})`);
    
    return await LeituraRepository.getLeiturasBySensor(id_sensor);
  } catch (error) {
    console.error('[SERVICE] Erro em listarPorSensor:', error);
    throw error;
  }
}

export async function obterRecente(id_sensor: number): Promise<Leitura | null> {
  try {
    return await LeituraRepository.getLeituraRecente(id_sensor);
  } catch (error) {
    console.error('[SERVICE] Erro em obterRecente:', error);
    throw error;
  }
}

export async function criar(dados: CreateLeituraInput): Promise<number> {
  try {
    console.log('[SERVICE] leiturasService.criar()', dados);

    if (!dados.id_sensor) throw new Error('ID do sensor é obrigatório');

    return await LeituraRepository.createLeitura(dados);
  } catch (error) {
    console.error('[SERVICE] Erro em criar:', error);
    throw error;
  }
}

export async function atualizar(id: number, dados: UpdateLeituraInput): Promise<number> {
  try {
    return await LeituraRepository.updateLeitura(id, dados);
  } catch (error) {
    console.error('[SERVICE] Erro em atualizar:', error);
    throw error;
  }
}

export async function deletar(id: number): Promise<number> {
  try {
    return await LeituraRepository.deleteLeitura(id);
  } catch (error) {
    console.error('[SERVICE] Erro em deletar:', error);
    throw error;
  }
}

// ─── Funções de API (usadas pelo Dashboard e Alertas) ───────────────

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/apiUrl";

export interface LeituraSensor {
  id_sensor: number;
  tipo_sensor: string;
  unidade_medida: string | null;
  nome_sensor: string | null;
  valor: number | null;
  valor_booleano: boolean | null;
  movimento: boolean | null;
  data_hora: string;
}

// Buscar as últimas leituras de cada sensor de um dispositivo via API
export async function buscarUltimasLeiturasPorDispositivo(id_dispositivo: number): Promise<LeituraSensor[]> {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return [];

    const response = await fetch(`${API_URL}/leituras/dispositivo/${id_dispositivo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData?.erro || resData?.mensagem || "Erro ao buscar leituras");
    }

    // CACHE OFFLINE- Usa a infraestrutura atual para salvar os dados recebidos da API no SQLite local, garantindo que a Dashboard funcione mesmo sem conexão depois
    try {
      let cacheSalvo = 0;
      for (const l of resData.dados?.leituras || []) {
        // Garante que o sensor exista na tabela local para o fallback funcionar depois
        await executeUpdate(
          `INSERT OR IGNORE INTO sensores (id_sensor, id_dispositivo, nome_sensor, tipo_sensor, unidade_medida) 
           VALUES (?, ?, ?, ?, ?)`,
          [l.id_sensor, id_dispositivo, l.nome_sensor || 'Sensor', l.tipo_sensor, l.unidade_medida]
        );

        const existe = await executeSelect('SELECT 1 FROM leituras WHERE id_sensor = ? AND data_hora = ?', [l.id_sensor, l.data_hora]);
        if (existe.length === 0) {
          // Usa INSERT direto porque a função criar() do repositório ignora a data_hora vinda da API
          await executeUpdate(
            `INSERT INTO leituras (id_sensor, valor, valor_booleano, movimento, data_hora, sincronizado)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [l.id_sensor, l.valor, l.valor_booleano ? 1 : 0, l.movimento ? 1 : 0, l.data_hora]
          );
          cacheSalvo++;
        }
      }
      if (cacheSalvo > 0) console.log(`[SERVICE] Cache da Dashboard salvo com sucesso: ${cacheSalvo} leituras.`);
    } catch (cacheErr) {
      console.error("[SERVICE] Erro de cache das leituras", cacheErr);
    }

    return resData.dados?.leituras || [];
  } catch (error) {
    console.log("[SERVICE] Fallback offline para buscarUltimasLeiturasPorDispositivo");
    try {
      const result = await executeSelect<any>(`
        SELECT s.id_sensor, s.tipo_sensor, s.unidade_medida, s.nome_sensor,
               l.valor, l.valor_booleano, l.movimento, MAX(l.data_hora) as data_hora
        FROM sensores s
        JOIN leituras l ON l.id_sensor = s.id_sensor
        WHERE s.id_dispositivo = ?
        GROUP BY s.id_sensor
      `, [id_dispositivo]);

      // Converte os inteiros do SQLite (0/1) para Booleanos reais, como a tela espera
      return (result || []).map(r => ({
        ...r,
        valor_booleano: r.valor_booleano === 1,
        movimento: r.movimento === 1,
      })) as LeituraSensor[];
    } catch (localErr) {
      console.error("[SERVICE] Erro no fallback da Dashboard:", localErr);
      return [];
    }
  }
}

// Buscar eventos/alertas do banco de dados via API
export async function buscarEventos(): Promise<any[]> {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return [];

    const response = await fetch(`${API_URL}/eventos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData?.erro || resData?.mensagem || "Erro ao buscar eventos");
    }

    // Sincronizando eventos com banco local...
    try {
      for (const ev of resData.dados || []) {
        const existe = await executeSelect('SELECT 1 FROM eventos WHERE id_evento = ?', [ev.id_evento]);
        if (existe.length === 0) {
          await executeUpdate(
            `INSERT INTO eventos (id_evento, id_dispositivo, id_sensor, tipo_evento, nivel_criticidade, data_evento, sincronizado)
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [ev.id_evento, ev.id_dispositivo, ev.id_sensor, ev.tipo_evento, ev.nivel_criticidade, ev.data_evento]
          );
        }
      }
    } catch (cacheErr) {
      console.error("[SERVICE] Erro de cache de eventos", cacheErr);
    }

    return resData.dados || [];
  } catch (error) {
    console.log("[SERVICE] Fallback offline para buscarEventos");
    try {
      return await EventoRepository.getAllEventos();
    } catch (localErr) {
      return [];
    }
  }
}

// Buscar o histórico geral de leituras agrupadas via API
export async function buscarHistoricoLeituras(): Promise<any[]> {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return [];

    const response = await fetch(`${API_URL}/leituras`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData?.erro || resData?.mensagem || "Erro ao buscar histórico de leituras");
    }

    return resData.dados?.leituras || resData.dados || [];
  } catch (error) {
    console.log("[SERVICE] Fallback offline para buscarHistoricoLeituras (SQL Lite");
    try {
      const result = await executeSelect<any>(`
        SELECT 
          strftime('%Y-%m-%dT%H:%M:%S.000Z', l.data_hora) as data_hora,
          MAX(CASE WHEN s.tipo_sensor = 'temperatura' THEN l.valor END) as temperatura,
          MAX(CASE WHEN s.tipo_sensor = 'umidade' THEN l.valor END) as umidade,
          MAX(CASE WHEN s.tipo_sensor = 'luminosidade' THEN l.valor END) as luminosidade,
          MAX(l.movimento) as movimento
        FROM leituras l
        JOIN sensores s ON s.id_sensor = l.id_sensor
        GROUP BY strftime('%Y-%m-%dT%H:%M:%S.000Z', l.data_hora)
        ORDER BY data_hora DESC
        LIMIT 50
      `);
      return result.map(r => ({
        ...r,
        movimento: r.movimento === 1
      }));
    } catch (localError) {
      return [];
    }
  }
}

// Limpar todo o histórico de leituras e eventos do usuário
export async function limparHistoricoGeral(): Promise<void> {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado");

    // Limpa eventos
    const respEventos = await fetch(`${API_URL}/eventos/limpar/todos`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!respEventos.ok) {
      const errData = await respEventos.json();
      throw new Error(errData?.erro || "Erro ao limpar eventos");
    }

    // Limpa leituras
    const respLeituras = await fetch(`${API_URL}/leituras/limpar/todos`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!respLeituras.ok) {
      const errData = await respLeituras.json();
      throw new Error(errData?.erro || "Erro ao limpar leituras");
    }

    console.log("[SERVICE] Histórico geral limpo com sucesso");
  } catch (error) {
    console.error("[SERVICE] Erro em limparHistoricoGeral:", error);
    throw error;
  }
}
