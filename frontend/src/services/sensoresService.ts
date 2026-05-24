// lógica de negócio para os sensores

import * as SensorRepository from '../repositories/SensorRepository';
import { Sensor, CreateSensorInput, UpdateSensorInput } from '../models/Sensor';

export async function listarTodos(): Promise<Sensor[]> {
  try {
    console.log('[SERVICE] sensoresService.listarTodos()');

    const sensores = await SensorRepository.getAllSensores();
    return sensores;
  } catch (error) {
    console.error('[SERVICE] Erro em listarTodos:', error);
    throw error;
  }
}

export async function listarPorDispositivo(id_dispositivo: number): Promise<Sensor[]> {
  try {
    console.log(`[SERVICE] sensoresService.listarPorDispositivo(${id_dispositivo})`);
    
    const sensores = await SensorRepository.getSensoresByDispositivo(id_dispositivo);
    return sensores;
  } catch (error) {
    console.error('[SERVICE] Erro em listarPorDispositivo:', error);
    throw error;
  }
}

export async function obter(id: number): Promise<Sensor | null> {
  try {
    return await SensorRepository.getSensorById(id);
  } catch (error) {
    console.error('[SERVICE] Erro em obter:', error);
    throw error;
  }
}

export async function criar(dados: CreateSensorInput): Promise<number> {
  try {
    console.log('[SERVICE] sensoresService.criar()', dados);

    if (!dados.nome_sensor) throw new Error('Nome do sensor é obrigatório');
    if (!dados.tipo_sensor) throw new Error('Tipo do sensor é obrigatório');

    return await SensorRepository.createSensor(dados);
  } catch (error) {
    console.error('[SERVICE] Erro em criar:', error);
    throw error;
  }
}

export async function atualizar(id: number, dados: UpdateSensorInput): Promise<number> {
  try {
    return await SensorRepository.updateSensor(id, dados);
  } catch (error) {
    console.error('[SERVICE] Erro em atualizar:', error);
    throw error;
  }
}

export async function deletar(id: number): Promise<number> {
  try {
    return await SensorRepository.deleteSensor(id);
  } catch (error) {
    console.error('[SERVICE] Erro em deletar:', error);
    throw error;
  }
}