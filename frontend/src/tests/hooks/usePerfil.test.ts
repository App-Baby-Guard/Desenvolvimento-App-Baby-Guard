import { usePerfil } from "../../hooks/usePerfil";
import { renderHook, act } from "@testing-library/react-native";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    token: "fake-jwt-token",
    atualizarUsuario: jest.fn(),
  }),
}));

describe("Hook usePerfil (Unitário)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  // TESTE UNITÁRIO
  // Verifica se o hook salva o perfil corretamente e atualiza os estados locais
  it("deve salvar o perfil com sucesso e atualizar estados", async () => {
    const setUsuario = jest.fn();
    const setNome = jest.fn();
    const setTelefone = jest.fn();

    const mockUser = {
      id_usuario: 1,
      nome: "Old Name",
      telefone: "123",
    };

    const mockUpdatedUser = {
      id_usuario: 1,
      nome: "New Name",
      telefone: "456",
    };

    const { result } = await renderHook(() =>
      usePerfil({
        usuario: mockUser,
        setUsuario,
        setNome,
        setTelefone,
      }),
    );

    await act(async () => {});

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ dados: mockUpdatedUser }),
    });

    let profileResult: any;

    await act(async () => {
      profileResult = await result.current.salvarPerfil(
        "New Name",
        "456",
        "photo-base64",
      );
    });

    expect(profileResult).toEqual(mockUpdatedUser);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(setUsuario).toHaveBeenCalledWith(mockUpdatedUser);
    expect(setNome).toHaveBeenCalledWith("New Name");
    expect(setTelefone).toHaveBeenCalledWith("456");
  });

  // TESTE UNITÁRIO
  // Verifica se o hook altera a senha corretamente via API mockada
  it("deve alterar senha com sucesso", async () => {
    const setUsuario = jest.fn();

    const mockUser = {
      id_usuario: 1,
      nome: "Old Name",
    };

    const { result } = await renderHook(() =>
      usePerfil({
        usuario: mockUser,
        setUsuario,
      }),
    );

    await act(async () => {});

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    let passwordResult: any;

    await act(async () => {
      passwordResult = await result.current.alterarSenha("new-secure-password");
    });

    expect(passwordResult).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // TESTE UNITÁRIO
  // Verifica se o hook trata corretamente erro na atualização do perfil
  it("deve lançar erro quando falhar a atualização do perfil", async () => {
    const setUsuario = jest.fn();

    const mockUser = {
      id_usuario: 1,
      nome: "Old Name",
    };

    const { result } = await renderHook(() =>
      usePerfil({
        usuario: mockUser,
        setUsuario,
      }),
    );

    await act(async () => {});

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
    });

    await act(async () => {
      await expect(
        result.current.salvarPerfil("Name", "123", ""),
      ).rejects.toThrow();
    });
  });
});
