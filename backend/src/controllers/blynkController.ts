import { Request, Response } from "express";
import { testarConexaoBlynk } from "../services/blynkSyncService";
import { Respostas } from "../utils/respostas";

export const testarBlynk = async (req: Request, res: Response) => {
  try {
    // Pega o token direto da URL
    const token = req.params.token;

    if (!token) {
      return res.status(400).json(Respostas.validacaoFalhou(["Token do Blynk é obrigatório na URL."]));
    }

    const dados = await testarConexaoBlynk(token);

    if (!dados) {
      return res.status(502).json(Respostas.erroInterno("Falha ao comunicar com o Blynk. O token pode ser inválido ou o Wokwi está offline."));
    }

    return res.status(200).json(Respostas.sucesso(dados, "Comunicação com Blynk realizada com sucesso!"));
  } catch (error: any) {
    console.error("[CTRL BLYNK] Erro na rota de teste:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};