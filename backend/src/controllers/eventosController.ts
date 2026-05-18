import { Request, Response } from "express";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";

import { Evento } from "../models/eventoModel";

// GET ALL
export const listarEventos = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query<Evento>(
      `SELECT id_evento, id_dispositivo, id_sensor, tipo_evento, nivel_criticidade, data_evento
       FROM eventos
       ORDER BY data_evento DESC`,
    );

    return res.json(Respostas.sucesso(rows, "Eventos listados com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// GET BY ID
export const buscarEventoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["ID obrigatório"]));
    }

    const { rows } = await pool.query<Evento>(
      `SELECT id_evento, id_dispositivo, id_sensor, tipo_evento, nivel_criticidade, data_evento
       FROM eventos
       WHERE id_evento = $1`,
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Evento não encontrado"));
    }

    return res.json(
      Respostas.sucesso(rows[0], "Evento encontrado com sucesso"),
    );
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// POST
export const criarEvento = async (req: Request, res: Response) => {
  try {
    const { id_dispositivo, id_sensor, tipo_evento, nivel_criticidade } =
      req.body;

    if (!id_dispositivo || !tipo_evento || !nivel_criticidade) {
      return res
        .status(400)
        .json(
          Respostas.validacaoFalhou(["Campos obrigatórios não informados"]),
        );
    }

    const dispositivo = await pool.query(
      `SELECT 1 FROM dispositivos WHERE id_dispositivo = $1`,
      [id_dispositivo],
    );

    if (dispositivo.rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Dispositivo não encontrado"));
    }

    if (id_sensor) {
      const sensor = await pool.query(
        `SELECT 1 FROM sensores WHERE id_sensor = $1`,
        [id_sensor],
      );

      if (sensor.rows.length === 0) {
        return res
          .status(404)
          .json(Respostas.naoEncontrado("Sensor não encontrado"));
      }
    }

    const { rows } = await pool.query<Evento>(
      `INSERT INTO eventos (id_dispositivo, id_sensor, tipo_evento, nivel_criticidade)
       VALUES ($1, $2, $3, $4)
       RETURNING id_evento, id_dispositivo, id_sensor, tipo_evento, nivel_criticidade, data_evento`,
      [
        id_dispositivo,
        id_sensor || null,
        Validacao.sanitizarString(tipo_evento),
        nivel_criticidade,
      ],
    );

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Evento criado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE
export const deletarEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      `DELETE FROM eventos WHERE id_evento = $1`,
      [id],
    );

    if (!rowCount) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Evento não encontrado"));
    }

    return res.json(Respostas.sucesso(null, "Evento deletado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
