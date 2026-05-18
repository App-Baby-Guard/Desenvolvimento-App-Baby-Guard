import { Request, Response } from "express";
import { pool } from "../config/database";
import { Respostas } from "../utils/respostas";
import { validarSchema, SCHEMAS } from "../utils/validacao";

const ok = (res: Response, dados: any, mensagem = "Sucesso") =>
  res.json(Respostas.sucesso(dados, mensagem));

const erro = (res: Response, status: number, resposta: any) =>
  res.status(status).json(resposta);

const idInvalido = (res: Response) =>
  erro(res, 400, Respostas.validacaoFalhou(["ID inválido"]));

const buscarSensor = async (id: number) => {
  const { rows } = await pool.query(
    `
    SELECT s.*, d.nome_dispositivo
    FROM sensores s
    JOIN dispositivos d ON d.id_dispositivo = s.id_dispositivo
    WHERE s.id_sensor = $1
    `,
    [id],
  );
  return rows[0];
};

//GET ALL
export const listarSensores = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, d.nome_dispositivo
      FROM sensores s
      JOIN dispositivos d ON d.id_dispositivo = s.id_dispositivo
      ORDER BY s.id_sensor
    `);
    return ok(res, rows, "Sensores listados com sucesso");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

//GET BY ID
export const buscarSensorPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return idInvalido(res);

    const sensor = await buscarSensor(id);
    if (!sensor) return erro(res, 404, Respostas.naoEncontrado("Sensor"));

    return ok(res, sensor, "Sensor encontrado");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

//POST
export const criarSensor = async (req: Request, res: Response) => {
  try {
    const validacao = validarSchema(req.body, SCHEMAS.SENSOR);
    if (!validacao.valido)
      return erro(res, 400, Respostas.validacaoFalhou(validacao.erros));

    const {
      id_dispositivo,
      nome_sensor,
      tipo_sensor,
      unidade_medida,
      descricao,
    } = req.body;

    const dispositivo = await pool.query(
      `SELECT 1 FROM dispositivos WHERE id_dispositivo = $1`,
      [id_dispositivo],
    );
    if (!dispositivo.rows.length)
      return erro(res, 404, Respostas.naoEncontrado("Dispositivo"));

    const { rows } = await pool.query(
      `
      INSERT INTO sensores (id_dispositivo, nome_sensor, tipo_sensor, unidade_medida, descricao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        id_dispositivo,
        nome_sensor,
        tipo_sensor,
        unidade_medida || null,
        descricao || null,
      ],
    );

    return res
      .status(201)
      .json(Respostas.criado(rows[0], "Sensor criado com sucesso"));
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

export const atualizarSensor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return idInvalido(res);

    const { nome_sensor, unidade_medida, descricao } = req.body;

    const { rows } = await pool.query(
      `
      UPDATE sensores
      SET nome_sensor = COALESCE($1, nome_sensor),
          unidade_medida = COALESCE($2, unidade_medida),
          descricao = COALESCE($3, descricao)
      WHERE id_sensor = $4
      RETURNING *
      `,
      [nome_sensor, unidade_medida, descricao, id],
    );

    if (!rows.length) return erro(res, 404, Respostas.naoEncontrado("Sensor"));
    return ok(res, rows[0], "Sensor atualizado com sucesso");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

//DELETE
export const deletarSensor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return idInvalido(res);

    const { rows } = await pool.query(
      `DELETE FROM sensores WHERE id_sensor = $1 RETURNING id_sensor`,
      [id],
    );

    if (!rows.length) return erro(res, 404, Respostas.naoEncontrado("Sensor"));
    return ok(res, null, "Sensor removido com sucesso");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};
