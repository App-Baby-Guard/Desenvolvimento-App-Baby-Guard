
// Esse arquivo é responsável por fazer as chamadas HTTP para a API de autenticação , Cada função 
// representa uma ação: login, cadastro, logout e validação do token.

// Endereço base da API. Se você mudar a porta, muda aqui.
const API_URL = 'http://localhost:3000';

// Esses tipos descrevem o formato dos dados que a API retorna.

export interface DadosUsuario {
  id_usuario: number;
  nome: string;
  email: string;
  telefone?: string | null;
  foto_perfil?: string | null;
  criado_em?: string;
}

export interface RespostaLogin {
  sucesso: boolean;
  mensagem: string;
  dados?: {
    token: string;
    usuario: DadosUsuario;
    dispositivos?: any[];
  };
}

export interface RespostaCadastro {
  sucesso: boolean;
  mensagem: string;
  dados?: {
    token: string;
    usuario: DadosUsuario;
  };
}

export interface RespostaGenerica {
  sucesso: boolean;
  mensagem: string;
}

// FUNÇÕES 

export async function loginApi(email: string, senha: string): Promise<RespostaLogin> {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senha }), // a API espera "password"
  });

  const dados = await resposta.json();
  return dados;
}

//essa parte faz o cadastro do usuário, enviando os dados para a api, telefone é opicional 
export async function cadastrarApi(
  nome: string,
  email: string,
  senha: string,
  telefone?: string
): Promise<RespostaCadastro> {
  const corpo: any = { nome, email, password: senha }; // a API espera "password"
  if (telefone) corpo.telefone = telefone;

  const resposta = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });

  const dados = await resposta.json();
  return dados;
}

//faz o logout do usuário, invalidando o token no backend. O token é enviado no header Authorization.
export async function logoutApi(token: string): Promise<RespostaGenerica> {
  const resposta = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();
  return dados;
}
//valida o token e verifica se é válido e retorna os dados do usuário associado a ele. O token é enviado no header Authorization.

export async function validarTokenApi(token: string): Promise<RespostaGenerica & { dados?: { usuario: DadosUsuario } }> {
  const resposta = await fetch(`${API_URL}/auth/validar`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();
  return dados;
}