import React from "react";
import { useAuth, AuthProvider } from "../../context/AuthContext";
import { renderHook, act } from "@testing-library/react-native";

describe("AuthContext — hook useAuth", () => {
  // TESTE UNITÁRIO
  // Verifica se o hook lança erro quando utilizado fora do AuthProvider.
  it("deve lançar erro se usado fora do AuthProvider", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(renderHook(() => useAuth())).rejects.toThrow(
      "useAuth deve ser usado dentro de AuthProvider",
    );

    consoleErrorSpy.mockRestore();
  });

  // TESTE UNITÁRIO
  // Verifica o estado inicial do contexto quando o hook é utilizado dentro do AuthProvider.
  it("deve retornar o valor do contexto se usado dentro do AuthProvider", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    expect(result.current.estaLogado).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.usuario).toBeNull();
  });

  // TESTE UNITÁRIO
  // Verifica se a função salvarSessao atualiza corretamente o estado de autenticação.
  it("deve atualizar estado de autenticação após chamar salvarSessao", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.salvarSessao("test-token", {
        id_usuario: 1,
        nome: "Test",
        email: "test@example.com",
      });
    });

    expect(result.current.estaLogado).toBe(true);
    expect(result.current.token).toBe("test-token");
    expect(result.current.usuario).toEqual({
      id_usuario: 1,
      nome: "Test",
      email: "test@example.com",
    });
  });

  // TESTE UNITÁRIO
  // Verifica se a função limparSessao remove corretamente os dados da sessão.
  it("deve limpar estado de autenticação após chamar limparSessao", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.salvarSessao("test-token", {
        id_usuario: 1,
        nome: "Test",
        email: "test@example.com",
      });

      result.current.limparSessao();
    });

    expect(result.current.estaLogado).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.usuario).toBeNull();
  });
});
