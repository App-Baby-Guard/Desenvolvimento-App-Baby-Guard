import {
  initDatabase,
  getDatabase,
  executeSelect,
  executeUpdate,
  executeTransaction,
} from "../../database/sqlite";
import * as SQLite from "expo-sqlite";

describe("Utilitários sqlite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica se a inicialização do banco utiliza corretamente a API do SQLite.
  it("deve inicializar o banco de dados com sucesso", async () => {
    await initDatabase();

    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("babyguard.db");
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica a integração da camada de acesso a dados com consultas SELECT.
  it("deve executar consulta select com sucesso", async () => {
    const mockDb = getDatabase();

    (mockDb.getAllAsync as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const result = await executeSelect("SELECT * FROM table", [1]);

    expect(result).toEqual([{ id: 1 }]);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith("SELECT * FROM table", [1]);
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica a integração da camada de acesso a dados com operações de atualização.
  it("deve executar query de atualização com sucesso", async () => {
    const mockDb = getDatabase();

    (mockDb.runAsync as jest.Mock).mockResolvedValue({ changes: 3 });

    const result = await executeUpdate("UPDATE table SET name = ?", ["test"]);

    expect(result).toBe(3);

    expect(mockDb.runAsync).toHaveBeenCalledWith("UPDATE table SET name = ?", [
      "test",
    ]);
  });

  // TESTE DE INTEGRAÇÃO
  // Verifica a execução de transações utilizando a conexão com o banco.
  it("deve executar transação com sucesso", async () => {
    const mockDb = getDatabase();
    const callback = jest.fn();

    await executeTransaction(callback);

    expect(mockDb.withTransactionAsync).toHaveBeenCalled();

    expect(callback).toHaveBeenCalled();
  });
});
