import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/apiUrl";
import { Dispositivo, CreateDispositivoInput, UpdateDispositivoInput } from '../models/Dispositivo';


// Listar todos os dispositivos ativos do usuário logado
export async function listarDispositivos(): Promise<Dispositivo[]> {
    try {
        console.log('[SERVICE] dispositivosService.listarDispositivos()');
        
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
            throw new Error(resData?.erro || resData?.mensagem || "Erro ao obter dispositivos do servidor");
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

        console.log(`[SERVICE] dispositivosService.listarDispositivos: ${dispositivos.length} dispositivos encontrados`);
        return dispositivos;
    } catch (error) {
        console.error('[SERVICE] Erro em listarDispositivos:', error);
        throw error;
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