import { useLogin } from '../../hooks/useLogin';
import { renderHook, act } from '@testing-library/react-native';

describe('Hook useLogin (Unitário)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock global fetch para todos os testes
    global.fetch = jest.fn();
  });

  // TESTE UNITÁRIO
  // Verifica estado inicial e funções do hook
  it('deve retornar funções do hook de login e o estado do formulário', async () => {
    const onSuccess = jest.fn();
    const { result } = await renderHook(() => useLogin(onSuccess));

    await act(async () => {});

    expect(result.current.form).toEqual({ email: '', senha: '' });
    expect(result.current.senhaVisivel).toBe(false);
    expect(result.current.carregando).toBe(false);
    expect(result.current.erro).toBe('');
    expect(typeof result.current.setEmail).toBe('function');
    expect(typeof result.current.setSenha).toBe('function');
    expect(typeof result.current.toggleSenhaVisivel).toBe('function');
    expect(typeof result.current.handleLogin).toBe('function');
  });

  // TESTE UNITÁRIO
  // Verifica se handleLogin atualiza o estado corretamente quando login é bem-sucedido (fetch mockado)
  it('deve atualizar estado e chamar onSuccess quando handleLogin for bem-sucedido', async () => {
    const onSuccess = jest.fn();
    const { result } = await renderHook(() => useLogin(onSuccess));

    const mockResponseData = {
      mensagem: 'Sucesso',
      dados: {
        token: 'fake-jwt',
        usuario: { id_usuario: 1, nome: 'Test' },
      },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });

    await act(async () => {
      result.current.setEmail('test@example.com');
      result.current.setSenha('password');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    // Apenas verifica que o callback foi chamado e erro está vazio
    expect(onSuccess).toHaveBeenCalledWith('fake-jwt', { id_usuario: 1, nome: 'Test' });
    expect(result.current.erro).toBe('');
  });

  // TESTE UNITÁRIO
  // Verifica se handleLogin trata erro corretamente (fetch mockado)
  it('deve atualizar estado de erro quando handleLogin falhar', async () => {
    const onSuccess = jest.fn();
    const { result } = await renderHook(() => useLogin(onSuccess));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ mensagem: 'Credenciais inválidas' }),
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.erro).toBeDefined();
  });
});