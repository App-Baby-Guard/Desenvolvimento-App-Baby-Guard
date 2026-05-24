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