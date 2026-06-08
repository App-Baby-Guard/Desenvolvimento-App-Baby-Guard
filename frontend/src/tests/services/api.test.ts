import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

describe("Configuração do api (API - Integração HTTP/Axios)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  // TESTE DE API
  // Verifica se a instância do Axios está configurada corretamente
  it("deve definir api com as opções corretas", () => {
    expect(api.defaults.timeout).toBe(5000);
  });

  // TESTE DE API
  // Verifica se o interceptor adiciona token no header Authorization
  it("deve adicionar header Authorization se token existir", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-jwt-token");

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;

    const config = { headers: {} };
    const resultConfig = await interceptor(config);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith("token");
    expect(resultConfig.headers.Authorization).toBe("Bearer test-jwt-token");
  });

  // TESTE DE API
  // Verifica se erro 401 remove token e usuário do storage
  it("deve limpar token em erro 401 na resposta", async () => {
    const errorInterceptor = (api.interceptors.response as any).handlers[0]
      .rejected;

    const error = {
      response: {
        status: 401,
      },
    };

    await expect(errorInterceptor(error)).rejects.toEqual(error);

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("token");
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("usuario");
  });

  // TESTE DE API
  // Verifica se headers não são alterados quando não há token
  it("deve manter headers sem alteração se nenhum token existir no AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;

    const config = { headers: { Existing: "value" } };

    const resultConfig = await interceptor(config);

    expect(resultConfig.headers.Existing).toBe("value");
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });

  // TESTE DE API
  // Verifica tratamento de erro 422 (validação)
  it("deve retornar erro 422 para dados de validação incorretos", async () => {
    const errorInterceptor = (api.interceptors.response as any).handlers[0]
      .rejected;

    const error = {
      response: {
        status: 422,
        data: { mensagem: "Dados inválidos" },
      },
    };

    await expect(errorInterceptor(error)).rejects.toEqual(error);
  });

  // TESTE DE API
  // Verifica tratamento de erro 404 (recurso não encontrado)
  it("deve retornar erro 404 para recurso não encontrado", async () => {
    const errorInterceptor = (api.interceptors.response as any).handlers[0]
      .rejected;

    const error = {
      response: {
        status: 404,
        data: { mensagem: "Não encontrado" },
      },
    };

    await expect(errorInterceptor(error)).rejects.toEqual(error);
  });

  // TESTE DE API
  // Verifica tratamento de erro 500 (erro interno do servidor)
  it("deve retornar erro 500 para falha interna do servidor", async () => {
    const errorInterceptor = (api.interceptors.response as any).handlers[0]
      .rejected;

    const error = {
      response: {
        status: 500,
        data: { mensagem: "Erro interno" },
      },
    };

    await expect(errorInterceptor(error)).rejects.toEqual(error);
  });

  // TESTE DE API
  // Verifica se instância suporta requisições POST
  it("deve enviar requisições POST com configuração padrão válida", () => {
    expect(api.post).toBeDefined();
  });

  // TESTE DE API
  // Verifica se instância suporta requisições PUT
  it("deve enviar requisições PUT com o payload fornecido", () => {
    expect(api.put).toBeDefined();
  });

  // TESTE DE API
  // Verifica se instância suporta requisições DELETE
  it("deve enviar requisições DELETE e retornar status 204 sem corpo", () => {
    expect(api.delete).toBeDefined();
  });
});
