import { Response } from "express";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";
import { AuthRequest } from "../middleware/autenticacao";
import { Dispositivo } from "../models/dispositivoModel";

// GET ALL (apenas do usuário logado)
export const listarDispositivos = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;

    if (!id_usuario) {
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    const { rows } = await pool.query<Dispositivo>(
      `SELECT id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
              token_dispositivo, status_dispositivo, ativo, criado_em
       FROM dispositivos
       WHERE id_usuario = $1 AND ativo = true
       ORDER BY id_dispositivo`,
      [id_usuario],
    );

    return res.json(
      Respostas.sucesso(rows, "Dispositivos listados com sucesso"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// POST (cria dispositivo associado ao usuário logado)
export const criarDispositivo = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario || req.body.id_usuario;
    const { nome_dispositivo, token_dispositivo, uuid_dispositivo } = req.body;

    if (!id_usuario) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["ID do usuário é obrigatório"]));
    }

    if (!nome_dispositivo) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Nome do dispositivo é obrigatório"]));
    }

    const usuario = await pool.query(
      `SELECT 1 FROM usuarios WHERE id_usuario = $1`,
      [id_usuario],
    );

    if (usuario.rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Usuário não encontrado"));
    }

    // Se o cliente enviou uuid_dispositivo, inserimos ele explicitamente
    let query = `
      INSERT INTO dispositivos (id_usuario, nome_dispositivo, token_dispositivo, status_dispositivo, ativo, uuid_dispositivo)
      VALUES ($1, $2, $3, 'offline', true, $4)
      RETURNING id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
                token_dispositivo, status_dispositivo, ativo, criado_em
    `;
    let params = [
      id_usuario,
      Validacao.sanitizarString(nome_dispositivo),
      token_dispositivo || null,
      uuid_dispositivo || null,
    ];

    if (!uuid_dispositivo) {
      query = `
        INSERT INTO dispositivos (id_usuario, nome_dispositivo, token_dispositivo, status_dispositivo, ativo)
        VALUES ($1, $2, $3, 'offline', true)
        RETURNING id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
                  token_dispositivo, status_dispositivo, ativo, criado_em
      `;
      params = [
        id_usuario,
        Validacao.sanitizarString(nome_dispositivo),
        token_dispositivo || null,
      ];
    }

    const { rows } = await pool.query<Dispositivo>(query, params);

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Dispositivo criado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// PATCH (atualiza/renomeia dispositivo apenas se pertencer ao usuário logado)
export const atualizarDispositivo = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    const { uuid } = req.params;
    const { nome_dispositivo } = req.body;

    if (!id_usuario) {
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    if (!nome_dispositivo) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Nome do dispositivo é obrigatório"]));
    }

    const { rows } = await pool.query<Dispositivo>(
      `UPDATE dispositivos
       SET nome_dispositivo = $1
       WHERE uuid_dispositivo = $2 AND id_usuario = $3 AND ativo = true
       RETURNING id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
                 token_dispositivo, status_dispositivo, ativo, criado_em`,
      [Validacao.sanitizarString(nome_dispositivo), uuid, id_usuario],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(
          Respostas.naoEncontrado(
            "Dispositivo não encontrado ou não pertence a este usuário",
          ),
        );
    }

    return res.json(
      Respostas.sucesso(rows[0], "Dispositivo renomeado com sucesso"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE (hard-delete de dispositivo apenas se pertencer ao usuário logado)
export const deletarDispositivo = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    const { uuid } = req.params;

    if (!id_usuario) {
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    const { rows } = await pool.query(
      `DELETE FROM dispositivos
       WHERE uuid_dispositivo = $1 AND id_usuario = $2
       RETURNING id_dispositivo`,
      [uuid, id_usuario],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(
          Respostas.naoEncontrado(
            "Dispositivo não encontrado ou não pertence a este usuário",
          ),
        );
    }

    return res.json(Respostas.sucesso(null, "Dispositivo removido com sucesso do banco de dados"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
