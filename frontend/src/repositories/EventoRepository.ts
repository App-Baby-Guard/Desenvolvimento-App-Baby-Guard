// crud dos eventos

import { executeSelect, executeSelectOne, executeUpdate } from '../database/sqlite';
import { Evento, CreateEventoInput, UpdateEventoInput } from '../models/Evento';

export async function getAllEventos(): Promise<Evento[]> {
    try {
        console.log('EventoRepository.getAllEventos()');

        const query = `SELECT * FROM eventos ORDER BY data_evento DESC`;
        const eventos = await executeSelect<Evento>(query);

        console.log(`EventoRepository.getAllEventos: ${eventos.length} eventos encontrados`);
        return eventos;
    } catch (error) {
        console.error('Erro em getAllEventos:', error);
        throw error;
    }
}

export async function getEventosByDispositivo(id_dispositivo: number): Promise<Evento[]> {
    try {
        console.log(`EventoRepository.getEventosByDispositivo(${id_dispositivo})`);

        const query = `SELECT * FROM eventos WHERE id_dispositivo = ? ORDER BY data_evento DESC`;
        const eventos = await executeSelect<Evento>(query, [id_dispositivo]);

        console.log(`EventoRepository.getEventosByDispositivo: ${eventos.length} eventos encontrados`);
        return eventos;
    } catch (error) {
        console.error('Erro em getEventosByDispositivo:', error);
        throw error;
    }
}

export async function getEventosCriticos(): Promise<Evento[]> {
    try {
        console.log('EventoRepository.getEventosCriticos()');

        const query = `SELECT * FROM eventos WHERE nivel_criticidade = 'crítico' ORDER BY data_evento DESC`;
        const eventos = await executeSelect<Evento>(query);


        console.log(`EventoRepository.getEventosCriticos: ${eventos.length} eventos críticos encontrados`);
        return eventos;
    } catch (error) {
        console.error('Erro em getEventosCriticos:', error);
        throw error;
    }
}

export async function createEvento(data: CreateEventoInput): Promise<number> {
    try {
        console.log('EventoRepository.createEvento()', data);
        const query = `
      INSERT INTO eventos (id_dispositivo, id_sensor, tipo_evento, nivel_criticidade, sincronizado)
      VALUES (?, ?, ?, ?, ?)
    `;
        const params = [
            data.id_dispositivo,
            data.id_sensor || null,
            data.tipo_evento,
            data.nivel_criticidade || 'normal',
            data.sincronizado || 0,
        ];

        const changes = await executeUpdate(query, params);

        console.log(`EventoRepository.createEvento: ${changes} evento(s) inserido(s)`);
        return changes;
    } catch (error) {
        console.error('Erro em createEvento:', error);
        throw error;
    }
}

export async function updateEvento(id: number, data: UpdateEventoInput): Promise<number> {
    try {
        console.log(`EventoRepository.updateEvento(${id})`, data);

        const fields: string[] = [];
        const params: any[] = [];

        if (data.nivel_criticidade !== undefined) {
            fields.push('nivel_criticidade = ?');
            params.push(data.nivel_criticidade);
        }
        if (data.sincronizado !== undefined) {
            fields.push('sincronizado = ?');
            params.push(data.sincronizado);
        }

        if (fields.length === 0) return 0;

        params.push(id);

        const query = `UPDATE eventos SET ${fields.join(', ')} WHERE id_evento = ?`;
        const changes = await executeUpdate(query, params);

        console.log(`EventoRepository.updateEvento: ${changes} evento(s) atualizado(s)`);

        return changes;
    } catch (error) {
        console.error('Erro em updateEvento:', error);
        throw error;
    }
}

export async function deleteEvento(id: number): Promise<number> {
    try {
        console.log(`EventoRepository.deleteEvento(${id})`);

        const query = `DELETE FROM eventos WHERE id_evento = ?`;
        const changes = await executeUpdate(query, [id]);

        console.log(`EventoRepository.deleteEvento: ${changes} evento(s) deletado(s)`);
        return changes;
    } catch (error) {
        console.error('Erro em deleteEvento:', error);
        throw error;
    }
}