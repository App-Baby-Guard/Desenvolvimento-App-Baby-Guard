import { Request, Response } from "express";
import { pool } from "../config/database";
import { Respostas } from "../utils/respostas";

import { Leitura } from "../models/leituraModel";

// GET ALL
export const listarLeituras = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query<Leitura>(
      `SELECT id_leitura, id_sensor, valor, valor_booleano, movimento, data_hora
       FROM leituras
       ORDER BY data_hora DESC`,
    );

    return res
      .status(200)
      .json(
        Respostas.sucesso(
          { quantidade: rows.length, leituras: rows },
          "Leituras listadas com sucesso",
        ),
      );
  } catch (error: any) {
    console.error("Erro ao listar leituras:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// GET BY ID
export const buscarLeituraPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json(Respostas.validacaoFalhou(["ID inválido"]));
    }

    const { rows } = await pool.query<Leitura>(
      `SELECT id_leitura, id_sensor, valor, valor_booleano, movimento, data_hora
       FROM leituras
       WHERE id_leitura = $1`,
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Leitura não encontrada"));
    }

    return res
      .status(200)
      .json(Respostas.sucesso(rows[0], "Leitura encontrada com sucesso"));
  } catch (error: any) {
    console.error("Erro ao buscar leitura:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// POST
export const criarLeitura = async (req: Request, res: Response) => {
  try {
    const { id_sensor, valor, valor_booleano, movimento } = req.body;

    if (!id_sensor) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["ID do sensor é obrigatório"]));
    }

    if (
      valor === undefined &&
      valor_booleano === undefined &&
      movimento === undefined
    ) {
      return res
        .status(400)
        .json(
          Respostas.validacaoFalhou(["Informe ao menos um valor de leitura"]),
        );
    }

    const sensor = await pool.query(
      `SELECT 1 FROM sensores WHERE id_sensor = $1`,
      [id_sensor],
    );

    if (sensor.rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Sensor não encontrado"));
    }

    const { rows } = await pool.query<Leitura>(
      `INSERT INTO leituras (id_sensor, valor, valor_booleano, movimento)
       VALUES ($1, $2, $3, $4)
       RETURNING id_leitura, id_sensor, valor, valor_booleano, movimento, data_hora`,
      [id_sensor, valor ?? null, valor_booleano ?? null, movimento ?? null],
    );

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Leitura criada com sucesso"));
  } catch (error: any) {
    console.error("Erro ao criar leitura:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE
export const deletarLeitura = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json(Respostas.validacaoFalhou(["ID inválido"]));
    }

    const { rowCount } = await pool.query(
      `DELETE FROM leituras WHERE id_leitura = $1`,
      [id],
    );

    if (!rowCount) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Leitura não encontrada"));
    }

    return res
      .status(200)
      .json(Respostas.sucesso(null, "Leitura removida com sucesso"));
  } catch (error: any) {
    console.error("Erro ao deletar leitura:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
