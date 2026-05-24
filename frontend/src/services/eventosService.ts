// lógica de negócio para os eventos

import * as EventoRepository from '../repositories/EventoRepository';
import { Evento, CreateEventoInput, UpdateEventoInput } from '../models/Evento';

export async function listarTodos(): Promise<Evento[]> {
  try {
    console.log('[SERVICE] eventosService.listarTodos()');

    return await EventoRepository.getAllEventos();
  } catch (error) {
    console.error('[SERVICE] Erro em listarTodos:', error);
    throw error;
  }
}

export async function listarPorDispositivo(id_dispositivo: number): Promise<Evento[]> {
  try {
    return await EventoRepository.getEventosByDispositivo(id_dispositivo);
  } catch (error) {
    console.error('[SERVICE] Erro em listarPorDispositivo:', error);
    throw error;
  }
}

export async function listarCriticos(): Promise<Evento[]> {
  try {
    console.log('[SERVICE] eventosService.listarCriticos()');
    
    return await EventoRepository.getEventosCriticos();
  } catch (error) {
    console.error('[SERVICE] Erro em listarCriticos:', error);
    throw error;
  }
}

export async function criar(dados: CreateEventoInput): Promise<number> {
  try {
    console.log('[SERVICE] eventosService.criar()', dados);

    if (!dados.id_dispositivo) throw new Error('ID do dispositivo é obrigatório');
    if (!dados.tipo_evento) throw new Error('Tipo de evento é obrigatório');

    return await EventoRepository.createEvento(dados);
  } catch (error) {
    console.error('[SERVICE] Erro em criar:', error);
    throw error;
  }
}

export async function atualizar(id: number, dados: UpdateEventoInput): Promise<number> {
  try {
    return await EventoRepository.updateEvento(id, dados);
  } catch (error) {
    console.error('[SERVICE] Erro em atualizar:', error);
    throw error;
  }
}

export async function deletar(id: number): Promise<number> {
  try {
    return await EventoRepository.deleteEvento(id);
  } catch (error) {
    console.error('[SERVICE] Erro em deletar:', error);
    throw error;
  }
}