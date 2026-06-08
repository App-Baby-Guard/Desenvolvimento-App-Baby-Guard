import { roboController } from "../../controllers/roboController";
import * as dispositivoService from "../../services/dispositivosService";

jest.mock("../../services/dispositivosService");

describe("Controlador roboController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listarRobos", () => {
    // TESTE UNITÁRIO
    // Verifica se o controlador retorna a lista de dispositivos fornecida pelo serviço.
    it("deve listar dispositivos com sucesso", async () => {
      const mockDevices = [
        {
          id_dispositivo: 1,
          uuid_dispositivo: "abc",
          nome_dispositivo: "Robo1",
          status_dispositivo: "online",
          ativo: 1,
        },
      ];

      (dispositivoService.listarDispositivos as jest.Mock).mockResolvedValue(
        mockDevices,
      );

      const result = await roboController.listarRobos();

      expect(result).toEqual(mockDevices);
      expect(dispositivoService.listarDispositivos).toHaveBeenCalledTimes(1);
    });

    // TESTE UNITÁRIO
    // Verifica se o controlador propaga corretamente erros retornados pelo serviço.
    it("deve lançar erro se a listagem falhar", async () => {
      (dispositivoService.listarDispositivos as jest.Mock).mockRejectedValue(
        new Error("API Error"),
      );

      await expect(roboController.listarRobos()).rejects.toThrow("API Error");
    });
  });

  describe("buscarRobo", () => {
    // TESTE UNITÁRIO
    // Verifica se o controlador busca um dispositivo pelo UUID informado.
    it("deve obter um dispositivo por UUID com sucesso", async () => {
      const mockDevice = {
        id_dispositivo: 1,
        uuid_dispositivo: "abc",
        nome_dispositivo: "Robo1",
        status_dispositivo: "online",
        ativo: 1,
      };

      (dispositivoService.obterPorUUID as jest.Mock).mockResolvedValue(
        mockDevice,
      );

      const result = await roboController.buscarRobo("abc");

      expect(result).toEqual(mockDevice);
      expect(dispositivoService.obterPorUUID).toHaveBeenCalledWith("abc");
    });
  });

  describe("registrarRobo", () => {
    // TESTE UNITÁRIO
    // Verifica se o controlador registra corretamente um novo dispositivo.
    it("deve registrar um novo dispositivo com sucesso", async () => {
      (dispositivoService.obterPorUUID as jest.Mock).mockResolvedValue(null);

      (dispositivoService.criarDispositivo as jest.Mock).mockResolvedValue(1);

      const result = await roboController.registrarRobo(
        "Robo Novo",
        "new-uuid",
      );

      expect(result).toBe(1);

      expect(dispositivoService.criarDispositivo).toHaveBeenCalledWith({
        uuid_dispositivo: "new-uuid",
        nome_dispositivo: "Robo Novo",
        status_dispositivo: "offline",
        ativo: 1,
      });
    });

    // TESTE UNITÁRIO
    // Verifica se o controlador valida corretamente a obrigatoriedade do nome do robô.
    it("deve lançar erro se o nome estiver vazio", async () => {
      await expect(roboController.registrarRobo("", "uuid")).rejects.toThrow(
        "O nome do robô é obrigatório.",
      );
    });
  });

  describe("renomearRobo", () => {
    // TESTE UNITÁRIO
    // Verifica se o controlador renomeia corretamente um dispositivo existente.
    it("deve renomear um dispositivo com sucesso", async () => {
      (dispositivoService.obterPorUUID as jest.Mock).mockResolvedValue({
        id_dispositivo: 1,
        uuid_dispositivo: "abc",
      });

      (dispositivoService.atualizarDispositivo as jest.Mock).mockResolvedValue(
        1,
      );

      const result = await roboController.renomearRobo("abc", "Robo Renomeado");

      expect(result).toBe(1);

      expect(dispositivoService.atualizarDispositivo).toHaveBeenCalledWith(1, {
        nome_dispositivo: "Robo Renomeado",
      });
    });
  });
});
