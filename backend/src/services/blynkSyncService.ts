import axios from "axios";

//  testar a comunicação com o Blynk e validar os dados
export const testarConexaoBlynk = async (tokenBlynk: string) => {
  try {
    console.log(`[BLYNK TESTE] Buscando dados no Blynk para o token: ${tokenBlynk}`);

    const url = `https://blynk.cloud/external/api/get?token=${tokenBlynk}&v3&v4&v5&v6`;
    
    // O timeout evita que o backend fique travado esperando uma resposta do Blynk caso a internet caia
    const response = await axios.get(url, { timeout: 5000 });

    const dados = response.data;

    //  imprimir os dados no console para validar se estão chegando certo
    console.log("[BLYNK TESTE] Resposta recebida com sucesso!");
    console.log(`- Temperatura (V3):  ${dados.v3}`);
    console.log(`- Umidade (V4):      ${dados.v4}`);
    console.log(`- Luminosidade (V5): ${dados.v5}`);
    console.log(`- Distância (V6):    ${dados.v6}`);

    return dados;
  } catch (erro: any) {
    console.error("[BLYNK TESTE] Falha ao comunicar com a API do Blynk:", erro.message);
    return null;
  }
};
