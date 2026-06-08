jest.unmock("../../context/ThemeContext");

import React from "react";
import { useTheme, ThemeProvider } from "../../context/ThemeContext";
import { renderHook, act } from "@testing-library/react-native";

describe("ThemeContext - hook useTheme", () => {
  // TESTE UNITÁRIO
  // Verifica se o hook lança erro quando utilizado fora do ThemeProvider.
  it("deve lançar erro se usado fora do ThemeProvider", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(renderHook(() => useTheme())).rejects.toThrow(
      "useTheme deve ser usado dentro de ThemeProvider",
    );

    consoleErrorSpy.mockRestore();
  });

  // TESTE UNITÁRIO
  // Verifica se o contexto retorna seus valores padrão ao ser utilizado dentro do ThemeProvider.
  it("deve retornar o valor do contexto padrão", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = await renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDarkMode).toBe(false);
    expect(typeof result.current.toggleDarkMode).toBe("function");
  });

  // TESTE UNITÁRIO
  // Verifica se a função toggleDarkMode altera corretamente o estado para modo escuro.
  it("deve alternar para modo escuro após chamar toggleDarkMode", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = await renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.toggleDarkMode(true);
    });

    expect(result.current.isDarkMode).toBe(true);
  });

  // TESTE UNITÁRIO
  // Verifica se a função toggleDarkMode retorna corretamente para o modo claro.
  it("deve alternar de volta para modo claro se chamar toggleDarkMode duas vezes", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = await renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.toggleDarkMode(true);
      result.current.toggleDarkMode(false);
    });

    expect(result.current.isDarkMode).toBe(false);
  });
});
