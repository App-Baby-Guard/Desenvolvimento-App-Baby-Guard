import * as dispositivoService from "../services/dispositivosService";
import { Dispositivo } from "../models/Dispositivo";

export const roboController = {
  /**
   * Busca todos os robôs salvos no banco SQLite local
   */
  async listarRobos(): Promise<Dispositivo[]> {
    try {
      const dispositivos = await dispositivoService.listarDispositivos();
      return dispositivos;
    } catch (error: any) {
      console.error("Erro ao listar robôs:", error);
      throw new Error(error.message || "Não foi possível carregar seus robôs. Verifique sua conexão.");
    }
  },

  /**
   * Busca os detalhes de um dispositivo pelo UUID
   */
  async buscarRobo(uuid: string): Promise<Dispositivo | null> {
    try {
      return await dispositivoService.obterPorUUID(uuid);
    } catch (error: any) {
      console.error("Erro ao buscar detalhes do robô:", error);
      throw new Error(error.message || "Não foi possível carregar os dados deste robô.");
    }
  },

  /**
   * Registra um novo robô no banco SQLite
   * Validações de nome e UUID são feitas aqui (regra de negócio no Controller)
   */
  async registrarRobo(nome: string, uuid: string): Promise<number> {
    if (!nome.trim()) throw new Error("O nome do robô é obrigatório.");
    if (!uuid.trim()) throw new Error("O ID do dispositivo é obrigatório.");

    try {
      // Verifica duplicidade pelo UUID
      const existente = await dispositivoService.obterPorUUID(uuid);
      if (existente) throw new Error("Já existe um robô cadastrado com esse UUID.");

      const result = await dispositivoService.criarDispositivo({
        uuid_dispositivo: uuid,
        nome_dispositivo: nome,
        status_dispositivo: 'offline', // Todo novo dispositivo entra offline até conectar ao MQTT
        ativo: 1,
      });
      return result;
    } catch (error: any) {
      const message = error?.message || "Não foi possível registrar o robô. Verifique os dados.";
      throw new Error(message);
    }
  },

  /**
   * Renomeia um robô existente no banco SQLite
   */
  async renomearRobo(uuid: string, novoNome: string): Promise<number> {
    if (!novoNome.trim()) throw new Error("O novo nome não pode ser vazio.");

    try {
      const dispositivo = await dispositivoService.obterPorUUID(uuid);
      if (!dispositivo || dispositivo.id_dispositivo === undefined)
        throw new Error("Robô não encontrado no banco de dados.");

      const result = await dispositivoService.atualizarDispositivo(dispositivo.id_dispositivo, {
        nome_dispositivo: novoNome,
      });
      return result;
    } catch (error: any) {
      console.error("Erro ao renomear robô:", error);
      throw new Error(error.message || "Não foi possível renomear o robô.");
    }
  },

  /**
   * Remove (soft delete) um robô do banco SQLite
   */
  async removerRobo(uuid: string): Promise<number> {
    try {
      const dispositivo = await dispositivoService.obterPorUUID(uuid);
      if (!dispositivo || dispositivo.id_dispositivo === undefined)
        throw new Error("Robô não encontrado no banco de dados.");

      const result = await dispositivoService.deletarDispositivo(dispositivo.id_dispositivo);
      return result;
    } catch (error: any) {
      console.error("Erro ao remover robô:", error);
      throw new Error(error.message || "Não foi possível excluir o robô.");
    }
  }
};