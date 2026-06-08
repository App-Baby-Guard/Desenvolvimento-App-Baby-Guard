import React from "react";
import App from "../App";
import { render, waitFor, act } from "@testing-library/react-native";
import * as sqlite from "../database/sqlite";
import * as schema from "../database/migrations/schema";

jest.mock("../database/sqlite");
jest.mock("../database/migrations/schema");
jest.mock("../routes/RootNavigator", () => "RootNavigator");

describe("Componente App (E2E/Flow)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE E2E
  // Verifica o fluxo completo de inicialização da aplicação:
  // inicialização do banco + criação de tabelas + renderização do app
  it("deve inicializar a base de dados e renderizar a aplicação com sucesso", async () => {
    (sqlite.initDatabase as jest.Mock).mockResolvedValue(undefined);
    (sqlite.getDatabase as jest.Mock).mockReturnValue({});
    (schema.createTables as jest.Mock).mockResolvedValue(undefined);
    (sqlite.listTables as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(sqlite.initDatabase).toHaveBeenCalledTimes(1);
      expect(schema.createTables).toHaveBeenCalledTimes(1);
    });
  });

  // TESTE E2E
  // Verifica se a aplicação exibe tela de loading enquanto inicializa serviços locais
  it("deve exibir tela de carregamento durante inicialização do banco de dados", async () => {
    const dbPromise = new Promise(() => {}); // nunca resolve (simula loading)

    (sqlite.initDatabase as jest.Mock).mockReturnValue(dbPromise);
    (sqlite.getDatabase as jest.Mock).mockReturnValue({});

    const { getByText } = await render(<App />);

    expect(getByText("Iniciando serviços locais...")).toBeTruthy();
  });
});
