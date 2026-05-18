export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  senha_hash: string;
  telefone?: string | null;
  foto_perfil?: string | null;
  push_token?: string | null;
  criado_em: Date;
}