// crud dos dispositivos: Executar TODAS as queries SQL relacionadas a dispositivos

import { getDatabase, executeSelect, executeSelectOne, executeUpdate } from "../database/sqlite";
import { Dispositivo, CreateDispositivoInput, UpdateDispositivoInput } from "../models/Dispositivo";

//READ - Select * from dispositivos
export async function getAllDispositivos(): Promise<Dispositivo[]> {
    try {
        console.log('[REPO] DispositivoRepositoriy.getAllDispositivos()');

        const query = 'SELECT * FROM dispositivos WHERE ativo = 1 ORDER BY criado_em DESC';
        const dispositivos = await executeSelect<Dispositivo>(query);

        console.log(`DispositivoRepository.getAllDispositivos: ${dispositivos.length} dispositivos encontrados`);
        return dispositivos;
    } catch (error) {
        console.error('[REPO] ERRO em getAllDispositivos:', error);
        throw error;
    }
}

//READ - Select * from dispositivos WHERE id = ?
export async function getDispositivoById(id: number): Promise<Dispositivo | null> {
    try {
        console.log(`[REPO] DispositivoRepository.getDispositivoById(${id})`);

        const query = 'SELECT * FROM dispositivos WHERE id_dispositivo = ? AND ativo = 1';
        const dispositivo = await executeSelectOne<Dispositivo>(query, [id]);

        console.log(`[REPO] DispositivoRepository.getDispositivoById: dispositivo ${dispositivo ? 'encontrado' : 'não encontrado'}`);
        return dispositivo;
    } catch (error) {
        console.error(`[REPO] ERRO em getDispositivoById(${id}):`, error);
        throw error;
    }
}

// READ: Select * from dispositivos WHERE uuid_dispositivo = ?
export async function getDispositivoByUUID(uuid: string): Promise<Dispositivo | null> {
    try {
        console.log(`[REPO] DispositivoRepository.getDispositivoByUUID(${uuid})`);

        const query = 'SELECT * FROM dispositivos WHERE uuid_dispositivo = ? AND ativo = 1';
        const dispositivo = await executeSelectOne<Dispositivo>(query, [uuid]);

        return dispositivo;
    } catch (error) {
        console.error(`[REPO] ERRO em getDispositivoByUUID(${uuid}):`, error);
        throw error;
    }
}

// CREATE: Insert dispositivos
export async function createDispositivo(data: CreateDispositivoInput): Promise<number> {
    try {
        console.log(`[REPO] DispositivoRepository.createDispositivo()`, data);

        const query = `
      INSERT INTO dispositivos (
        uuid_dispositivo,
        id_usuario,
        nome_dispositivo,
        status_dispositivo,
        ativo
      ) VALUES (?, ?, ?, ?, ?)
    `;


        const params = [
            data.uuid_dispositivo,
            data.id_usuario || null,
            data.nome_dispositivo,
            data.status_dispositivo || 'offline',
            data.ativo || 1,
        ];

        const changes = await executeUpdate(query, params);
        console.log(`[REPO] DispositivoRepository.createDispositivo: ${changes} dispositivo criado`);

        return changes;
    } catch (error) {
        console.error('[REPO] ERRO em createDispositivo:', error);
        throw error;
    }
}


// UPDATE: Update dispositivos SET ... WHERE xx = ?
export async function updateDispositivo(
    id: number,
    data: UpdateDispositivoInput
): Promise<number> {
    try {
        console.log(`[REPO] DispositivoRepository.updateDispositivo(${id})`, data);

        const fields: string[] = [];
        const params: any[] = [];

        // Monta dinamicamente os campos a atualizar
        if (data.nome_dispositivo !== undefined) {
            fields.push('nome_dispositivo = ?');
            params.push(data.nome_dispositivo);
        }
        if (data.status_dispositivo !== undefined) {
            fields.push('status_dispositivo = ?');
            params.push(data.status_dispositivo);
        }
        if (data.ativo !== undefined) {
            fields.push('ativo = ?');
            params.push(data.ativo);
        }

        // Sempre atualiza timestamp
        fields.push('atualizado_em = CURRENT_TIMESTAMP');

        // Se não há campos, não faz nada
        if (fields.length === 1) {
            console.log(`[REPO] DispositivoRepository.updateDispositivo(${id}): Nenhum campo a atualizar`);
            return 0;
        }

        // Adiciona ID no final
        params.push(id);

        const query = `UPDATE dispositivos SET ${fields.join(', ')} WHERE id_dispositivo = ?`;
        const changes = await executeUpdate(query, params);

        console.log(`[REPO] DispositivoRepository.updateDispositivo(${id}): ${changes} dispositivo atualizado`);
        return changes;
    } catch (error) {
        console.error(`[REPO] ERRO em updateDispositivo(${id}):`, error);
        throw error;
    }
}

// DELETE: Soft delete apenas marca como inativo (ativo = 0)
export async function deleteDispositivo(id: number): Promise<number> {
    try {
        console.log(`[REPO] DispositivoRepository.deleteDispositivo(${id})`);

        const query = `UPDATE dispositivos SET ativo = 0, atualizado_em = CURRENT_TIMESTAMP WHERE id_dispositivo = ?`;
        const changes = await executeUpdate(query, [id]);

        console.log(`[REPO] DispositivoRepository.deleteDispositivo(${id}): ${changes} dispositivo desativado (soft delete)`);
        return changes;
    } catch (error) {
        console.error(`[REPO] ERRO em deleteDispositivo(${id}):`, error);
        throw error;
    }
}

//contar dispositivos ativos
export async function countDispositivos(): Promise<number> {
    try {
        const result = await executeSelectOne<{ count: number }>(
            `SELECT COUNT(*) as count FROM dispositivos WHERE ativo = 1`
        );

        const count = result?.count || 0;

        console.log(`[REPO] DispositivoRepository.countDispositivos: ${count} dispositivos ativos`);
        return count;
    } catch (error) {
        console.error(`[REPO] ERRO em countDispositivos:`, error);
        throw error;
    }
}

// Busca dispositivo pelo UUID incluindo registros inativos
export async function getDispositivoByUUIDFull(uuid: string): Promise<Dispositivo | null> {
    try {
        console.log(`[REPO] DispositivoRepository.getDispositivoByUUIDFull(${uuid})`);

        //remove o and ativo = 1 para buscar tanto ativos quanto inativos
        const query = 'SELECT * FROM dispositivos WHERE uuid_dispositivo = ?';
        const dispositivo = await executeSelectOne<Dispositivo>(query, [uuid]);

        return dispositivo;

    } catch (error) {
        console.error(`[REPO] ERRO em getDispositivoByUUIDFull(${uuid}):`, error);
        throw error;
    }
}

