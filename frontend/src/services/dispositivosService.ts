// logica de negocio dos dispositivos

import * as DispositivoRepository from '../repositories/DispositivoRepository';
import { Dispositivo, CreateDispositivoInput, UpdateDispositivoInput } from '../models/Dispositivo';

// Listar todos os dispositivos ativos

export async function listarDispositivos(): Promise<Dispositivo[]> {
    try {
        console.log('[SERVICE] dispositivosService.listarDispositivos()');
        const dispositivos = await DispositivoRepository.getAllDispositivos();

        console.log(`[SERVICE] dispositivosService.listarDispositivos: ${dispositivos.length} dispositivos encontrados`);
        return dispositivos;
    } catch (error) {
        console.error('[SERVICE] Erro em listarDispositivos:', error);
        throw error;
    }
}

// dispositivo pelo ID
export async function obterDispositivo(id: number): Promise<Dispositivo | null> {
    try {
        console.log(`[SERVICE] dispositivosService.obterDispositivo(${id})`);
        const dispositivo = await DispositivoRepository.getDispositivoById(id);

        return dispositivo;
    } catch (error) {
        console.error('[SERVICE] Erro em obterDispositivo:', error);
        throw error;
    }
}

// dispositivo pelo UUID
export async function obterPorUUID(uuid: string): Promise<Dispositivo | null> {
    try {
        console.log(`[SERVICE] dispositivosService.obterPorUUID('${uuid}')`);
        const dispositivo = await DispositivoRepository.getDispositivoByUUID(uuid);

        return dispositivo;
    } catch (error) {
        console.error('[SERVICE] Erro em obterPorUUID:', error);
        throw error;
    }
}

//Criar novo dispositivo UUID e nome obrigatórios

export async function criarDispositivo(dados: CreateDispositivoInput): Promise<number> {
    try {
        console.log('[SERVICE] dispositivosService.criarDispositivo()', dados);

        // Validações
        if (!dados.uuid_dispositivo || dados.uuid_dispositivo.trim() === '') {
            throw new Error('UUID do dispositivo é obrigatório');
        }
        if (!dados.nome_dispositivo || dados.nome_dispositivo.trim() === '') {
            throw new Error('Nome do dispositivo é obrigatório');
        }

        console.log('[SERVICE] Validações passaram');

        const result = await DispositivoRepository.createDispositivo(dados);

        console.log('[SERVICE] dispositivosService.criarDispositivo: Dispositivo criado com sucesso');
        return result;
    } catch (error) {
        console.error('[SERVICE] Erro em criarDispositivo:', error);
        throw error;
    }
}

// Atualizar dispositivo existente
export async function atualizarDispositivo(
    id: number,
    dados: UpdateDispositivoInput
): Promise<number> {
    try {
        console.log(`[SERVICE] dispositivosService.atualizarDispositivo(${id})`);

        // Verifica se existe
        const existe = await DispositivoRepository.getDispositivoById(id);
        if (!existe) {
            throw new Error(`Dispositivo ${id} não encontrado`);
        }

        const result = await DispositivoRepository.updateDispositivo(id, dados);
        console.log('[SERVICE] dispositivosService.atualizarDispositivo: Dispositivo atualizado com sucesso');

        return result;
    } catch (error) {
        console.error('[SERVICE] Erro em atualizarDispositivo:', error);
        throw error;
    }
}

// Deletar dispositivo (soft delete) - marca como inativo
export async function deletarDispositivo(id: number): Promise<number> {
    try {
        console.log(`[SERVICE] dispositivosService.deletarDispositivo(${id})`);

        const existe = await DispositivoRepository.getDispositivoById(id);
        if (!existe) {
            throw new Error(`Dispositivo ${id} não encontrado`);
        }

        const result = await DispositivoRepository.deleteDispositivo(id);
        console.log('[SERVICE] dispositivosService.deletarDispositivo: Dispositivo deletado com sucesso');

        return result;
    } catch (error) {
        console.error('[SERVICE] Erro em deletarDispositivo:', error);
        throw error;
    }
}

// Contar dispositivos
export async function contarDispositivos(): Promise<number> {
    try {
        console.log('[SERVICE] dispositivosService.contarDispositivos()');
        const count = await DispositivoRepository.countDispositivos();

        return count;
    } catch (error) {
        console.error('[SERVICE] Erro em contarDispositivos:', error);
        throw error;
    }
}