import * as SensorRepository from "../../repositories/SensorRepository";
import * as sqlite from "../../database/sqlite";

jest.mock("../../database/sqlite");

describe("Repositório SensorRepository (Integração)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se o repositório busca corretamente todos os sensores do banco
  it("deve buscar todos os sensores", async () => {
    const mockSensors = [{ id_sensor: 1, nome_sensor: "DHT11" }];

    (sqlite.executeSelect as jest.Mock).mockResolvedValue(mockSensors);

    const result = await SensorRepository.getAllSensores();

    expect(result).toEqual(mockSensors);
    expect(sqlite.executeSelect).toHaveBeenCalledWith(
      "SELECT * FROM sensores ORDER BY criado_em DESC",
    );
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se o repositório cria um novo sensor corretamente no banco
  it("deve criar um sensor", async () => {
    (sqlite.executeUpdate as jest.Mock).mockResolvedValue(1);

    const input = {
      id_dispositivo: 2,
      nome_sensor: "DHT22",
      tipo_sensor: "temperatura",
      unidade_medida: "°C",
    };

    const result = await SensorRepository.createSensor(input);

    expect(result).toBe(1);
    expect(sqlite.executeUpdate).toHaveBeenCalled();
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se o repositório remove corretamente um sensor do banco
  it("deve deletar um sensor", async () => {
    (sqlite.executeUpdate as jest.Mock).mockResolvedValue(1);

    const result = await SensorRepository.deleteSensor(1);

    expect(result).toBe(1);
    expect(sqlite.executeUpdate).toHaveBeenCalledWith(
      "DELETE FROM sensores WHERE id_sensor = ?",
      [1],
    );
  });
});
