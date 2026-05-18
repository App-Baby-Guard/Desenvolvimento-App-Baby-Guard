import bcrypt from "bcryptjs";
import { pool } from "../config/database";
import { gerarToken } from "../middleware/autenticacao";
import { Validacao } from "../utils/validacao";

export class AuthService {
  // Formata email
  static formatarEmail(email: string) {
    return email.toLowerCase().trim();
  }

  // Busca usuário
  static async buscarUsuarioPorEmail(email: string) {
    const { rows } = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1`,
      [this.formatarEmail(email)],
    );
    return rows[0];
  }

  static async buscarUsuarioPorId(id_usuario: number) {
    const { rows } = await pool.query(
      `
      SELECT id_usuario, nome, email, telefone, foto_perfil, push_token, criado_em
      FROM usuarios
      WHERE id_usuario = $1
      `,
      [id_usuario],
    );
    return rows[0];
  }

  // Registro
  static async registrar(data: {
    nome: string;
    email: string;
    password: string;
    telefone?: string;
  }) {
    if (!Validacao.isNomeValido(data.nome)) throw new Error("NOME_INVALIDO");
    if (!Validacao.isEmailValido(data.email)) throw new Error("EMAIL_INVALIDO");
    if (!Validacao.isPasswordValida(data.password))
      throw new Error("SENHA_INVALIDA");
    if (data.telefone && !Validacao.isTelefoneValido(data.telefone))
      throw new Error("TELEFONE_INVALIDO");

    const email = this.formatarEmail(data.email);
    if (await this.buscarUsuarioPorEmail(email))
      throw new Error("EMAIL_JA_CADASTRADO");

    const senha_hash = await bcrypt.hash(data.password, 10);

    const { rows } = await pool.query(
      `
      INSERT INTO usuarios (nome, email, senha_hash, telefone)
      VALUES ($1, $2, $3, $4)
      RETURNING id_usuario, nome, email, telefone, foto_perfil, push_token, criado_em
      `,
      [
        Validacao.sanitizarString(data.nome),
        email,
        senha_hash,
        data.telefone || null,
      ],
    );

    const usuario = rows[0];
    return { token: gerarToken(usuario.id_usuario, usuario.email), usuario };
  }

  // Login
  static async login(data: { email: string; password: string }) {
    const email = this.formatarEmail(data.email);
    const usuario = await this.buscarUsuarioPorEmail(email);
    if (!usuario || !(await bcrypt.compare(data.password, usuario.senha_hash)))
      throw new Error("CREDENCIAIS_INVALIDAS");

    const { rows: dispositivos } = await pool.query(
      `
      SELECT id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo, token_dispositivo, status_dispositivo, movimento, criado_em
      FROM dispositivos
      WHERE id_usuario = $1
      ORDER BY id_dispositivo
      `,
      [usuario.id_usuario],
    );

    delete usuario.senha_hash;
    return {
      token: gerarToken(usuario.id_usuario, usuario.email),
      usuario,
      dispositivos,
    };
  }

  // Valida token
  static async validarToken(id_usuario: number) {
    const usuario = await this.buscarUsuarioPorId(id_usuario);
    if (!usuario) throw new Error("USUARIO_NAO_ENCONTRADO");
    return { token_valido: true, usuario };
  }

  // Logout
  static async logout(token: string) {
    await pool.query(`INSERT INTO tokens_revogados (token) VALUES ($1)`, [
      token,
    ]);
    return { logout: true };
  }
}
