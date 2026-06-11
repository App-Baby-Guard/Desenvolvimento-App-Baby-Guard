import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";
import { AuthRequest } from "../middleware/autenticacao";

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
export const buscarUsuarioPorId = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const idUsuarioAutenticado = req.usuario?.id_usuario;

    // Impede que um usuário acesse o perfil de outro
    if (Number(id) !== idUsuarioAutenticado) {
      return res
        .status(403)
        .json(Respostas.naoAutorizado("Acesso negado: você não tem permissão para visualizar este perfil"));
    }

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

// PATCH
export const atualizarUsuario = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const idUsuarioAutenticado = req.usuario?.id_usuario;

    // Impede que um usuário atualize o perfil de outro
    if (Number(id) !== idUsuarioAutenticado) {
      return res
        .status(403)
        .json(Respostas.naoAutorizado("Acesso negado: você não tem permissão para atualizar este perfil"));
    }

    const { nome, email, senha, telefone, foto_perfil, push_token } = req.body;

    const campos: string[] = [];
    const valores: any[] = [];

    if (nome !== undefined) {
      if (!Validacao.isNomeValido(nome)) {
        return res
          .status(400)
          .json(Respostas.validacaoFalhou(["Nome inválido"]));
      }

      campos.push(`nome = $${valores.length + 1}`);
      valores.push(Validacao.sanitizarString(nome));
    }

    if (email !== undefined) {
      if (!Validacao.isEmailValido(email)) {
        return res
          .status(400)
          .json(Respostas.validacaoFalhou(["Email inválido"]));
      }

      const emailFormatado = email.toLowerCase().trim();

      const usuarioExistente = await pool.query(
        `
        SELECT 1
        FROM usuarios
        WHERE email = $1
        AND id_usuario != $2
        `,
        [emailFormatado, id],
      );

      if (usuarioExistente.rows.length > 0) {
        return res.status(409).json(Respostas.conflito("Email já cadastrado"));
      }

      campos.push(`email = $${valores.length + 1}`);
      valores.push(emailFormatado);
    }

    if (senha !== undefined) {
      if (!Validacao.isPasswordValida(senha)) {
        return res
          .status(400)
          .json(Respostas.validacaoFalhou(["Senha inválida"]));
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      campos.push(`senha_hash = $${valores.length + 1}`);
      valores.push(senhaHash);
    }

    if (telefone !== undefined) {
      if (telefone && !Validacao.isTelefoneValido(telefone)) {
        return res
          .status(400)
          .json(Respostas.validacaoFalhou(["Telefone inválido"]));
      }

      campos.push(`telefone = $${valores.length + 1}`);
      valores.push(telefone || null);
    }

    if (foto_perfil !== undefined) {
      campos.push(`foto_perfil = $${valores.length + 1}`);
      valores.push(foto_perfil || null);
    }

    if (push_token !== undefined) {
      campos.push(`push_token = $${valores.length + 1}`);
      valores.push(push_token || null);
    }

    if (!campos.length) {
      return res
        .status(400)
        .json(
          Respostas.validacaoFalhou(["Nenhum campo enviado para atualização"]),
        );
    }

    valores.push(id);

    const { rows } = await pool.query<Usuario>(
      `
      UPDATE usuarios
      SET ${campos.join(", ")}
      WHERE id_usuario = $${valores.length}
      RETURNING id_usuario, nome, email, telefone, foto_perfil, push_token, criado_em
      `,
      valores,
    );

    if (!rows[0]) {
      return res.status(404).json(Respostas.naoEncontrado("Usuário"));
    }

    return res.json(
      Respostas.sucesso(rows[0], "Usuário atualizado com sucesso"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE
export const deletarUsuario = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const idUsuarioAutenticado = req.usuario?.id_usuario;

    // Impede que um usuário delete a conta de outro
    if (Number(id) !== idUsuarioAutenticado) {
      return res
        .status(403)
        .json(Respostas.naoAutorizado("Acesso negado: você não tem permissão para deletar este perfil"));
    }

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
