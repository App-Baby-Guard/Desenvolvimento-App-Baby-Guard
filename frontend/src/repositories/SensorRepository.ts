// crud dos sensores
import { executeSelect, executeSelectOne, executeUpdate } from '../database/sqlite';
import { Sensor, CreateSensorInput, UpdateSensorInput } from '../models/Sensor';

export async function getAllSensores(): Promise<Sensor[]> {
    try {
        console.log('[REPO] SensorRepository.getAllSensores()');
        const query = `SELECT * FROM sensores ORDER BY criado_em DESC`;
        const sensores = await executeSelect<Sensor>(query);

        console.log(`[REPO] SensorRepository.getAllSensores: ${sensores.length} sensores encontrados`);
        return sensores;
    } catch (error) {
        console.error(`[REPO] Erro em getAllSensores:`, error);
        throw error;
    }
}

export async function getSensoresByDispositivo(id_dispositivo: number): Promise<Sensor[]> {
    try {
        console.log(`[REPO] SensorRepository.getSensoresByDispositivo(${id_dispositivo})`);

        const query = `SELECT * FROM sensores WHERE id_dispositivo = ? ORDER BY criado_em DESC`;
        const sensores = await executeSelect<Sensor>(query, [id_dispositivo]);

        console.log(`[REPO] SensorRepository.getSensoresByDispositivo: ${sensores.length} sensores encontrados`);
        return sensores;
    } catch (error) {
        console.error(`[REPO] Erro em getSensoresByDispositivo(${id_dispositivo}):`, error);
        throw error;
    }
}

export async function getSensorById(id: number): Promise<Sensor | null> {
    try {
        console.log(`[REPO] SensorRepository.getSensorById(${id})`);

        const query = `SELECT * FROM sensores WHERE id_sensor = ?`;
        const sensor = await executeSelectOne<Sensor>(query, [id]);

        console.log(`[REPO] SensorRepository.getSensorById: sensor ${sensor ? 'encontrado' : 'não encontrado'}`);
        return sensor;
    } catch (error) {
        console.error(`[REPO] Erro em getSensorById(${id}):`, error);
        throw error;
    }
}

export async function createSensor(data: CreateSensorInput): Promise<number> {
    try {
        console.log(`[REPO] SensorRepository.createSensor()`, data);
        const query = `
      INSERT INTO sensores (id_dispositivo, nome_sensor, tipo_sensor, unidade_medida)
      VALUES (?, ?, ?, ?)
    `;
        const params = [data.id_dispositivo, data.nome_sensor, data.tipo_sensor, data.unidade_medida || null];
        const changes = await executeUpdate(query, params);

        console.log(`[REPO] SensorRepository.createSensor: ${changes} sensor(es) inserido(s)`);
        return changes;
    } catch (error) {
        console.error(`[REPO] Erro em createSensor:`, error);
        throw error;
    }
}

export async function updateSensor(id: number, data: UpdateSensorInput): Promise<number> {
    try {
        console.log(`[REPO] SensorRepository.updateSensor(${id})`, data);
        const fields: string[] = [];
        const params: any[] = [];

        if (data.nome_sensor !== undefined) {
            fields.push('nome_sensor = ?');
            params.push(data.nome_sensor);
        }
        if (data.tipo_sensor !== undefined) {
            fields.push('tipo_sensor = ?');
            params.push(data.tipo_sensor);
        }
        if (data.unidade_medida !== undefined) {
            fields.push('unidade_medida = ?');
            params.push(data.unidade_medida);
        }

        if (fields.length === 0) return 0;

        params.push(id);
        const query = `UPDATE sensores SET ${fields.join(', ')} WHERE id_sensor = ?`;
        const changes = await executeUpdate(query, params);

        console.log(`[REPO] SensorRepository.updateSensor: ${changes} sensor(es) atualizado(s)`);
        return changes;
    } catch (error) {
        console.error(`[REPO] Erro em updateSensor(${id}):`, error);
        throw error;
    }
}

export async function deleteSensor(id: number): Promise<number> {
    try {
        console.log(`[REPO] SensorRepository.deleteSensor(${id})`);

        const query = `DELETE FROM sensores WHERE id_sensor = ?`;
        const changes = await executeUpdate(query, [id]);

        console.log(`[REPO] SensorRepository.deleteSensor: ${changes} sensor(es) deletado(s)`);
        return changes;
    } catch (error) {
        console.error(`[REPO] Erro em deleteSensor(${id}):`, error);
        throw error;
    }
}