import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/apiUrl";
import { Dispositivo, CreateDispositivoInput, UpdateDispositivoInput } from '../models/Dispositivo';
import * as DispositivoRepository from '../repositories/DispositivoRepository';
import { executeUpdate } from '../database/sqlite';


// Listar todos os dispositivos ativos do usuário logado
export async function listarDispositivos(): Promise<Dispositivo[]> {
    try {
        console.log('[SERVICE] dispositivosService.listarDispositivos() - Tentando API...');
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log('[SERVICE] Nenhum token JWT encontrado.');
            return [];
        }

        const response = await fetch(`${API_URL}/dispositivos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData?.erro || resData?.mensagem || "Erro ao obter dispositivos do servidor (API)");
        }

        const dispositivos: Dispositivo[] = (resData.dados || []).map((d: any) => ({
            id_dispositivo: d.id_dispositivo,
            uuid_dispositivo: d.uuid_dispositivo,
            id_usuario: d.id_usuario,
            nome_dispositivo: d.nome_dispositivo,
            status_dispositivo: d.status_dispositivo || 'offline',
            ativo: d.ativo ? 1 : 0,
            criado_em: d.criado_em,
        }));

        //sincornizar com o sqlite local
        console.log('[SERVICE] Sincronizando API -> SQLite local...');

        for (const disp of dispositivos) {
            //busca dispositivo ativo ou inativo

            const local = await DispositivoRepository.getDispositivoByUUIDFull(disp.uuid_dispositivo);
            // Se existe, reativa e atualiza
            if (local && typeof local.id_dispositivo === 'number') {
                // Se o ID do local for diferente do ID da API, atualiza o ID no local para manter a consistência (caso tenha sido criado offline antes de sincronizar)
                if (local.id_dispositivo !== disp.id_dispositivo) {
                    await executeUpdate('UPDATE dispositivos SET id_dispositivo = ? WHERE uuid_dispositivo = ?', [disp.id_dispositivo, disp.uuid_dispositivo]);
                }

                console.log(`[SERVICE] Atualizando dispositivo ${disp.id_dispositivo} no SQLite...`);
                await DispositivoRepository.updateDispositivo(disp.id_dispositivo as number, {
                    nome_dispositivo: disp.nome_dispositivo,
                    status_dispositivo: disp.status_dispositivo,
                    ativo: 1, //reativa se estava inativo
                });
            } else {
                console.log(`[SERVICE] Criando dispositivo ${disp.uuid_dispositivo} no SQLite...`);
                // Se não existe, cria
                await DispositivoRepository.createDispositivo(({
                    id_dispositivo: disp.id_dispositivo,
                    uuid_dispositivo: disp.uuid_dispositivo,
                    id_usuario: disp.id_usuario,
                    nome_dispositivo: disp.nome_dispositivo,
                    status_dispositivo: disp.status_dispositivo,
                    ativo: 1,
                } as any)); 
            }
        }

        //busca os locais atuais do SQLite para deletar os que não existem mais na API
        const locaisAtuais = await DispositivoRepository.getAllDispositivos();

        for (const local of locaisAtuais) {
            const encontradoNaAPI = dispositivos.find(d => d.uuid_dispositivo === local.uuid_dispositivo);

            //se não encontrado na API, deleta do local (soft delete)
            if (!encontradoNaAPI && local.id_dispositivo !== undefined) {
                console.log(`[SERVICE] Dispositivo fantasma detectado: ${local.nome_dispositivo}. Removendo localmente...`);
                await DispositivoRepository.deleteDispositivo(
                    local.id_dispositivo
                );
            }
        }

        console.log(`[SERVICE] dispositivosService.listarDispositivos: ${dispositivos.length} dispositivos encontrados`);

        return dispositivos;

    } catch (error) {
        //fallback(plano B): usa dados do SQLite local offline se a API falhar
        console.log('[SERVICE] API falhou, tentando fallback SQLite local...', error);
        return await DispositivoRepository.getAllDispositivos();
    }
}

// dispositivo pelo ID (obtém da lista carregada via API)
export async function obterDispositivo(id: number): Promise<Dispositivo | null> {
    try {
        console.log(`[SERVICE] dispositivosService.obterDispositivo(${id})`);
        const dispositivos = await listarDispositivos();
        return dispositivos.find(d => d.id_dispositivo === id) || null;
    } catch (error) {
        console.error('[SERVICE] Erro em obterDispositivo:', error);
        throw error;
    }
}

// dispositivo pelo UUID (obtém da lista carregada via API)
export async function obterPorUUID(uuid: string): Promise<Dispositivo | null> {
    try {
        console.log(`[SERVICE] dispositivosService.obterPorUUID('${uuid}')`);
        const dispositivos = await listarDispositivos();
        return dispositivos.find(d => d.uuid_dispositivo === uuid) || null;
    } catch (error) {
        console.error('[SERVICE] Erro em obterPorUUID:', error);
        throw error;
    }
}

// Criar novo dispositivo no Supabase via API
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

        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch(`${API_URL}/dispositivos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome_dispositivo: dados.nome_dispositivo,
                uuid_dispositivo: dados.uuid_dispositivo,
                token_dispositivo: null, // Futuro token opcional do ESP32
            })
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData?.erro || resData?.mensagem || "Erro ao cadastrar dispositivo no servidor");
        }

        console.log('[SERVICE] dispositivosService.criarDispositivo: Dispositivo criado com sucesso no Supabase');
        return 1;
    } catch (error) {
        console.error('[SERVICE] Erro em criarDispositivo:', error);
        throw error;
    }
}

// Atualizar dispositivo existente no Supabase via API
export async function atualizarDispositivo(
    id: number,
    dados: UpdateDispositivoInput
): Promise<number> {
    try {
        console.log(`[SERVICE] dispositivosService.atualizarDispositivo(${id})`);

        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        // Obtém o UUID a partir do ID
        const dispositivos = await listarDispositivos();
        const dispositivo = dispositivos.find(d => d.id_dispositivo === id);
        if (!dispositivo) {
            throw new Error(`Dispositivo ${id} não encontrado`);
        }

        const response = await fetch(`${API_URL}/dispositivos/${dispositivo.uuid_dispositivo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome_dispositivo: dados.nome_dispositivo,
            })
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData?.erro || resData?.mensagem || "Erro ao atualizar dispositivo no servidor");
        }

        console.log('[SERVICE] dispositivosService.atualizarDispositivo: Dispositivo atualizado com sucesso no Supabase');
        return 1;
    } catch (error) {
        console.error('[SERVICE] Erro em atualizarDispositivo:', error);
        throw error;
    }
}

// Deletar dispositivo (soft delete) no Supabase via API
export async function deletarDispositivo(id: number): Promise<number> {
    try {
        console.log(`[SERVICE] dispositivosService.deletarDispositivo(${id})`);

        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        // Obtém o UUID a partir do ID
        const dispositivos = await listarDispositivos();
        const dispositivo = dispositivos.find(d => d.id_dispositivo === id);
        if (!dispositivo) {
            throw new Error(`Dispositivo ${id} não encontrado`);
        }

        const response = await fetch(`${API_URL}/dispositivos/${dispositivo.uuid_dispositivo}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData?.erro || resData?.mensagem || "Erro ao deletar dispositivo no servidor");
        }

        console.log('[SERVICE] dispositivosService.deletarDispositivo: Dispositivo deletado com sucesso no Supabase');
        return 1;
    } catch (error) {
        console.error('[SERVICE] Erro em deletarDispositivo:', error);
        throw error;
    }
}

// Contar dispositivos ativos do usuário logado
export async function contarDispositivos(): Promise<number> {
    try {
        console.log('[SERVICE] dispositivosService.contarDispositivos()');
        const dispositivos = await listarDispositivos();
        return dispositivos.length;
    } catch (error) {
        console.error('[SERVICE] Erro em contarDispositivos:', error);
        throw error;
    }
}