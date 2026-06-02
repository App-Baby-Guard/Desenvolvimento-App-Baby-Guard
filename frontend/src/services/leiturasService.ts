// logica das leituras

import * as LeituraRepository from '../repositories/LeituraRepository';
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

    return resData.dados?.leituras || [];
  } catch (error) {
    console.error("[SERVICE] Erro em buscarUltimasLeiturasPorDispositivo:", error);
    return [];
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

    return resData.dados || [];
  } catch (error) {
    console.error("[SERVICE] Erro em buscarEventos:", error);
    return [];
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
    console.error("[SERVICE] Erro em buscarHistoricoLeituras:", error);
    return [];
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
