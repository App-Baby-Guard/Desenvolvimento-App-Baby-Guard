import { Request, Response } from "express";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";

import { Sensor } from "../models/sensorModel";

// GET ALL
export const listarSensores = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query<Sensor>(
      `SELECT id_sensor, id_dispositivo, nome_sensor, tipo_sensor, unidade_medida, descricao
       FROM sensores
       ORDER BY id_sensor`,
    );

    return res
      .status(200)
      .json(
        Respostas.sucesso(
          { quantidade: rows.length, sensores: rows },
          "Sensores listados com sucesso",
        ),
      );
  } catch (error: any) {
    console.error("Erro ao listar sensores:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// GET BY ID
export const buscarSensorPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json(Respostas.validacaoFalhou(["ID inválido"]));
    }

    const { rows } = await pool.query<Sensor>(
      `SELECT id_sensor, id_dispositivo, nome_sensor, tipo_sensor, unidade_medida, descricao
       FROM sensores
       WHERE id_sensor = $1`,
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Sensor não encontrado"));
    }

    return res
      .status(200)
      .json(Respostas.sucesso(rows[0], "Sensor encontrado com sucesso"));
  } catch (error: any) {
    console.error("Erro ao buscar sensor:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// POST
export const criarSensor = async (req: Request, res: Response) => {
  try {
    const {
      id_dispositivo,
      nome_sensor,
      tipo_sensor,
      unidade_medida,
      descricao,
    } = req.body;

    if (!id_dispositivo) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["ID do dispositivo é obrigatório"]));
    }

    if (!tipo_sensor) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Tipo do sensor é obrigatório"]));
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

    const { rows } = await pool.query<Sensor>(
      `INSERT INTO sensores (id_dispositivo, nome_sensor, tipo_sensor, unidade_medida, descricao)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id_sensor, id_dispositivo, nome_sensor, tipo_sensor, unidade_medida, descricao`,
      [
        id_dispositivo,
        nome_sensor ? Validacao.sanitizarString(nome_sensor) : null,
        Validacao.sanitizarString(tipo_sensor),
        unidade_medida || null,
        descricao || null,
      ],
    );

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Sensor criado com sucesso"));
  } catch (error: any) {
    console.error("Erro ao criar sensor:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE
export const deletarSensor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json(Respostas.validacaoFalhou(["ID inválido"]));
    }

    const { rowCount } = await pool.query(
      `DELETE FROM sensores WHERE id_sensor = $1`,
      [id],
    );

    if (!rowCount) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Sensor não encontrado"));
    }

    return res
      .status(200)
      .json(Respostas.sucesso(null, "Sensor removido com sucesso"));
  } catch (error: any) {
    console.error("Erro ao deletar sensor:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
