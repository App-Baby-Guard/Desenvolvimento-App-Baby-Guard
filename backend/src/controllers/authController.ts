import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { pool } from "../config/database";
import { gerarToken } from "../middleware/autenticacao";
import { adicionarTokenBlacklist } from "../middleware/tokenBlacklist";
import { Validacao, SCHEMAS, validarSchema } from "../utils/validacao";
import { Respostas } from "../utils/respostas";

export const registro = async (req: Request, res: Response) => {
  try {
    console.log("[REGISTRO] BODY:", req.body);

    const validacao = validarSchema(req.body, SCHEMAS.REGISTRO);

    if (!validacao.valido) {
      console.log("[REGISTRO] VALIDAÇÃO FALHOU:", validacao.erros);

      return res
        .status(400)
        .json(Respostas.validacaoFalhou(validacao.erros));
    }

    const { nome, email, password, telefone } = req.body;

    const emailFormatado = email.toLowerCase().trim();

    const usuarioExistente = await pool.query(
      `SELECT 1 FROM usuarios WHERE email = $1`,
      [emailFormatado],
    );

    if (usuarioExistente.rows.length > 0) {
      console.log("[REGISTRO] EMAIL JÁ CADASTRADO:", emailFormatado);

      return res
        .status(409)
        .json(Respostas.conflito("Email já cadastrado"));
    }

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

    console.log("[REGISTRO] SUCESSO:", usuario.email);

    return res.status(201).json(
      Respostas.sucesso(
        { token, usuario },
        "Usuário registrado com sucesso",
      ),
    );
  } catch (error: any) {
    console.error("[REGISTRO] ERRO:", error);

    return res.status(500).json(
      Respostas.erroInterno(
        error?.message || "Erro interno no registro",
      ),
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("[LOGIN] BODY:", req.body);

    const validacao = validarSchema(req.body, SCHEMAS.LOGIN);

    if (!validacao.valido) {
      console.log("[LOGIN] VALIDAÇÃO FALHOU:", validacao.erros);

      return res
        .status(400)
        .json(Respostas.validacaoFalhou(validacao.erros));
    }

    const { email, password } = req.body;

    const emailFormatado = email.toLowerCase().trim();

    console.log("[LOGIN] BUSCANDO USUÁRIO:", emailFormatado);

    const { rows } = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1`,
      [emailFormatado],
    );

    const usuario = rows[0];

    if (!usuario) {
      console.log("[LOGIN] USUÁRIO NÃO ENCONTRADO");

      return res
        .status(401)
        .json(Respostas.naoAutorizado("Email ou senha inválidos"));
    }

    console.log("[LOGIN] USUÁRIO ENCONTRADO:", usuario.email);

    const senhaCorreta = await bcrypt.compare(
      password,
      usuario.senha_hash,
    );

    if (!senhaCorreta) {
      console.log("[LOGIN] SENHA INCORRETA");

      return res
        .status(401)
        .json(Respostas.naoAutorizado("Email ou senha inválidos"));
    }

    console.log("[LOGIN] SENHA CORRETA");

    const { rows: dispositivos } = await pool.query(
      `SELECT id_dispositivo,uuid_dispositivo,nome_dispositivo,status_dispositivo,ativo,criado_em
       FROM dispositivos WHERE id_usuario = $1`,
      [usuario.id_usuario],
    );

    delete usuario.senha_hash;

    const token = gerarToken(usuario.id_usuario, usuario.email);

    console.log("[LOGIN] LOGIN REALIZADO:", usuario.email);

    return res.json(
      Respostas.sucesso(
        { token, usuario, dispositivos },
        "Login realizado com sucesso",
      ),
    );
  } catch (error: any) {
    console.error("[LOGIN] ERRO COMPLETO:", error);

    return res.status(500).json(
      Respostas.erroInterno(
        error?.message || "Erro interno no login",
      ),
    );
  }
};

export const validarToken = async (req: Request, res: Response) => {
  try {
    console.log("[VALIDAR TOKEN]");

    const usuarioToken = (req as any).usuario;

    if (!usuarioToken)
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Token inválido"));

    const { rows } = await pool.query(
      `SELECT id_usuario,nome,email,telefone,foto_perfil,push_token,criado_em
       FROM usuarios
       WHERE id_usuario = $1`,
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
    console.error("[VALIDAR TOKEN] ERRO:", error);

    return res.status(500).json(
      Respostas.erroInterno(
        error?.message || "Erro ao validar token",
      ),
    );
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    console.log("[LOGOUT]");

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

    return res.json(
      Respostas.sucesso(null, "Logout realizado com sucesso"),
    );
  } catch (error: any) {
    console.error("[LOGOUT] ERRO:", error);

    return res.status(500).json(
      Respostas.erroInterno(
        error?.message || "Erro ao realizar logout",
      ),
    );
  }
};