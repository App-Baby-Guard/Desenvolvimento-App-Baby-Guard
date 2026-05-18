import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { pool } from "../config/database";
import { gerarToken } from "../middleware/autenticacao";
import { adicionarTokenBlacklist } from "../middleware/tokenBlacklist";
import { Validacao, SCHEMAS, validarSchema } from "../utils/validacao";
import { Respostas } from "../utils/respostas";

export const registro = async (req: Request, res: Response) => {
  try {
    const validacao = validarSchema(req.body, SCHEMAS.REGISTRO);
    if (!validacao.valido)
      return res.status(400).json(Respostas.validacaoFalhou(validacao.erros));

    const { nome, email, password, telefone } = req.body;
    const emailFormatado = email.toLowerCase().trim();

    const usuarioExistente = await pool.query(
      `SELECT 1 FROM usuarios WHERE email = $1`,
      [emailFormatado],
    );
    if (usuarioExistente.rows.length > 0)
      return res.status(409).json(Respostas.conflito("Email já cadastrado"));

    const senhaHash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, telefone)
       VALUES ($1,$2,$3,$4)
       RETURNING id_usuario,nome,email,telefone,foto_perfil,push_token,criado_em`,
      [
        Validacao.sanitizarString(nome),
        emailFormatado,
        senhaHash,
        telefone || null,
      ],
    );

    const usuario = rows[0];
    const token = gerarToken(usuario.id_usuario, usuario.email);

    return res
      .status(201)
      .json(
        Respostas.sucesso({ token, usuario }, "Usuário registrado com sucesso"),
      );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validacao = validarSchema(req.body, SCHEMAS.LOGIN);
    if (!validacao.valido)
      return res.status(400).json(Respostas.validacaoFalhou(validacao.erros));

    const { email, password } = req.body;
    const emailFormatado = email.toLowerCase().trim();

    const { rows } = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1`,
      [emailFormatado],
    );
    const usuario = rows[0];
    if (!usuario)
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Email ou senha inválidos"));

    const senhaCorreta = await bcrypt.compare(password, usuario.senha_hash);
    if (!senhaCorreta)
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Email ou senha inválidos"));

    const { rows: dispositivos } = await pool.query(
      `SELECT id_dispositivo,uuid_dispositivo,nome_dispositivo,status_dispositivo,ativo,criado_em
       FROM dispositivos WHERE id_usuario = $1`,
      [usuario.id_usuario],
    );

    delete usuario.senha_hash;
    const token = gerarToken(usuario.id_usuario, usuario.email);

    return res.json(
      Respostas.sucesso(
        { token, usuario, dispositivos },
        "Login realizado com sucesso",
      ),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

export const validarToken = async (req: Request, res: Response) => {
  try {
    const usuarioToken = (req as any).usuario;
    if (!usuarioToken)
      return res.status(401).json(Respostas.naoAutorizado("Token inválido"));

    const { rows } = await pool.query(
      `SELECT id_usuario,nome,email,telefone,foto_perfil,push_token,criado_em FROM usuarios WHERE id_usuario = $1`,
      [usuarioToken.id_usuario],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json(Respostas.naoAutorizado("Usuário não encontrado"));

    return res.json(
      Respostas.sucesso(
        { token_valido: true, usuario: rows[0] },
        "Token válido",
      ),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Token não informado"));

    const [tipo, token] = authHeader.split(" ");
    if (tipo !== "Bearer" || !token)
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Formato do token inválido"));

    adicionarTokenBlacklist(token);
    return res.json(Respostas.sucesso(null, "Logout realizado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

export const recuperarSenha = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!Validacao.isEmailValido(email))
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Email inválido"]));

    return res.json(
      Respostas.sucesso(null, "Se o email existir, um link será enviado"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
