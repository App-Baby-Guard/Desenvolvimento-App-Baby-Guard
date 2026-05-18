import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";

import { Usuario } from "../models/usuarioModel";

// GET ALL
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const { rows } = await pool.query<Usuario>(
      `SELECT id_usuario, nome, email, telefone, foto_perfil, push_token, criado_em
       FROM usuarios
       ORDER BY id_usuario DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return res.json(
      Respostas.sucesso(
        {
          pagina: page,
          limite: limit,
          quantidade: rows.length,
          usuarios: rows,
        },
        "Usuários listados com sucesso",
      ),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// GET BY ID
export const buscarUsuarioPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query<Usuario>(
      `SELECT id_usuario, nome, email, telefone, foto_perfil, push_token, criado_em
       FROM usuarios
       WHERE id_usuario = $1`,
      [id],
    );

    if (!rows[0]) {
      return res.status(404).json(Respostas.naoEncontrado("Usuário"));
    }

    return res.json(
      Respostas.sucesso(rows[0], "Usuário encontrado com sucesso"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// POST
export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json(
          Respostas.validacaoFalhou(["Campos obrigatórios não informados"]),
        );
    }

    if (!Validacao.isNomeValido(nome)) {
      return res.status(400).json(Respostas.validacaoFalhou(["Nome inválido"]));
    }

    if (!Validacao.isEmailValido(email)) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Email inválido"]));
    }

    if (!Validacao.isPasswordValida(senha)) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Senha inválida"]));
    }

    if (telefone && !Validacao.isTelefoneValido(telefone)) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Telefone inválido"]));
    }

    const emailFormatado = email.toLowerCase().trim();

    const usuarioExistente = await pool.query(
      `SELECT 1 FROM usuarios WHERE email = $1`,
      [emailFormatado],
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json(Respostas.conflito("Email já cadastrado"));
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { rows } = await pool.query<Usuario>(
      `INSERT INTO usuarios (nome, email, senha_hash, telefone, criado_em)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING id_usuario, nome, email, telefone, foto_perfil, push_token, criado_em`,
      [
        Validacao.sanitizarString(nome),
        emailFormatado,
        senhaHash,
        telefone || null,
      ],
    );

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Usuário criado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE
export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      `DELETE FROM usuarios WHERE id_usuario = $1`,
      [id],
    );

    if (!rowCount) {
      return res.status(404).json(Respostas.naoEncontrado("Usuário"));
    }

    return res.json(Respostas.sucesso(null, "Usuário deletado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
