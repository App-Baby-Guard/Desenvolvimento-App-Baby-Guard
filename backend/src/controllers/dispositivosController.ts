import { Request, Response } from "express";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";

import { Dispositivo } from "../models/dispositivoModel";

// GET ALL
export const listarDispositivos = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query<Dispositivo>(
      `SELECT id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
              token_dispositivo, status_dispositivo, ativo, criado_em
       FROM dispositivos
       ORDER BY id_dispositivo`,
    );

    return res.json(
      Respostas.sucesso(rows, "Dispositivos listados com sucesso"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// POST
export const criarDispositivo = async (req: Request, res: Response) => {
  try {
    const { id_usuario, nome_dispositivo, token_dispositivo } = req.body;

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

    const { rows } = await pool.query<Dispositivo>(
      `INSERT INTO dispositivos (id_usuario, nome_dispositivo, token_dispositivo)
       VALUES ($1, $2, $3)
       RETURNING id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
                 token_dispositivo, status_dispositivo, ativo, criado_em`,
      [
        id_usuario,
        Validacao.sanitizarString(nome_dispositivo),
        token_dispositivo || null,
      ],
    );

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Dispositivo criado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
