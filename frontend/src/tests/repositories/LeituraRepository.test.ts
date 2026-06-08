import * as LeituraRepository from "../../repositories/LeituraRepository";
import * as sqlite from "../../database/sqlite";
import { CreateLeituraInput } from "../../models/Leitura";

jest.mock("../../database/sqlite");

describe("Repositório LeituraRepository (Integração)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se getAllLeituras busca corretamente todas as leituras do banco
  it("deve buscar todas as leituras", async () => {
    const mockReadings = [{ id_leitura: 1, valor: 25.5 }];
    (sqlite.executeSelect as jest.Mock).mockResolvedValue(mockReadings);

    const result = await LeituraRepository.getAllLeituras();

    expect(result).toEqual(mockReadings);
    expect(sqlite.executeSelect).toHaveBeenCalledWith(
      "SELECT * FROM leituras ORDER BY data_hora DESC",
    );
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se createLeitura insere corretamente uma nova leitura no banco
  it("deve inserir uma nova leitura", async () => {
    (sqlite.executeUpdate as jest.Mock).mockResolvedValue(1);

    const input: CreateLeituraInput = {
      id_sensor: 5,
      valor: 24.3,
      valor_booleano: 0,
      movimento: 1,
      sincronizado: 0,
    };

    const result = await LeituraRepository.createLeitura(input);

    expect(result).toBe(1);
    expect(sqlite.executeUpdate).toHaveBeenCalled();
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se deleteLeitura remove corretamente uma leitura do banco
  it("deve deletar uma leitura", async () => {
    (sqlite.executeUpdate as jest.Mock).mockResolvedValue(1);

    const result = await LeituraRepository.deleteLeitura(1);

    expect(result).toBe(1);
    expect(sqlite.executeUpdate).toHaveBeenCalledWith(
      "DELETE FROM leituras WHERE id_leitura = ?",
      [1],
    );
  });
});
