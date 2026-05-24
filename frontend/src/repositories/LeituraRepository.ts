// crud das leituras

import { executeSelect, executeSelectOne, executeUpdate } from '../database/sqlite';
import { Leitura, CreateLeituraInput, UpdateLeituraInput } from '../models/Leitura';

export async function getAllLeituras(): Promise<Leitura[]> {
    try {
        console.log('[REPO] LeituraRepository.getAllLeituras()');

        const query = `SELECT * FROM leituras ORDER BY data_hora DESC`;
        const leituras = await executeSelect<Leitura>(query);

        console.log(`LeituraRepository.getAllLeituras: ${leituras.length} leituras encontradas`);
        return leituras;
    } catch (error) {
        console.error('Erro em getAllLeituras:', error);
        throw error;
    }
}

export async function getLeiturasBySensor(id_sensor: number): Promise<Leitura[]> {
    try {
        console.log(`LeituraRepository.getLeiturasBySensor(${id_sensor})`);

        const query = `SELECT * FROM leituras WHERE id_sensor = ? ORDER BY data_hora DESC`;
        const leituras = await executeSelect<Leitura>(query, [id_sensor]);

        console.log(`LeituraRepository.getLeiturasBySensor: ${leituras.length} leituras encontradas`);
        return leituras;
    } catch (error) {
        console.error('Erro em getLeiturasBySensor:', error);
        throw error;
    }
}

export async function getLeituraRecente(id_sensor: number): Promise<Leitura | null> {
    try {
        console.log(`LeituraRepository.getLeituraRecente(${id_sensor})`);

        const query = `SELECT * FROM leituras WHERE id_sensor = ? ORDER BY data_hora DESC LIMIT 1`;
        const leitura = await executeSelectOne<Leitura>(query, [id_sensor]);

        console.log(`LeituraRepository.getLeituraRecente: leitura ${leitura ? 'encontrada' : 'não encontrada'}`);

        return leitura;
    } catch (error) {
        console.error('Erro em getLeituraRecente:', error);
        throw error;
    }
}

export async function createLeitura(data: CreateLeituraInput): Promise<number> {
    try {
        console.log('[REPO] LeituraRepository.createLeitura()', data);
        const query = `
      INSERT INTO leituras (id_sensor, valor, valor_booleano, movimento, sincronizado)
      VALUES (?, ?, ?, ?, ?)
    `;
        const params = [
            data.id_sensor,
            data.valor || null,
            data.valor_booleano !== undefined ? data.valor_booleano : null,
            data.movimento !== undefined ? data.movimento : null,
            data.sincronizado || 0,
        ];

        const changes = await executeUpdate(query, params);

        console.log(`LeituraRepository.createLeitura: ${changes} leitura(s) inserida(s)`);
        return changes;
    } catch (error) {
        console.error('Erro em createLeitura:', error);
        throw error;
    }
}

export async function updateLeitura(id: number, data: UpdateLeituraInput): Promise<number> {
    try {
        console.log(`[REPO] LeituraRepository.updateLeitura(${id})`, data);
        const fields: string[] = [];
        const params: any[] = [];

        if (data.valor !== undefined) {
            fields.push('valor = ?');
            params.push(data.valor);
        }
        if (data.sincronizado !== undefined) {
            fields.push('sincronizado = ?');
            params.push(data.sincronizado);
        }

        if (fields.length === 0) return 0;

        params.push(id);

        const query = `UPDATE leituras SET ${fields.join(', ')} WHERE id_leitura = ?`;
        const changes = await executeUpdate(query, params);

        console.log(`LeituraRepository.updateLeitura: ${changes} leitura(s) atualizada(s)`);
        return changes;
    } catch (error) {
        console.error('Erro em updateLeitura:', error);
        throw error;
    }
}

export async function deleteLeitura(id: number): Promise<number> {
    try {
        console.log(`LeituraRepository.deleteLeitura(${id})`);

        const query = `DELETE FROM leituras WHERE id_leitura = ?`;
        const changes = await executeUpdate(query, [id]);

        console.log(`LeituraRepository.deleteLeitura: ${changes} leitura(s) deletada(s)`);
        return changes;
    } catch (error) {
        console.error('Erro em deleteLeitura:', error);
        throw error;
    }
}