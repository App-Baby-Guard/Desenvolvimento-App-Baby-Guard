import { Request, Response } from "express";
import { pool } from "../config/database";
import { Respostas } from "../utils/respostas";
import { validarSchema, SCHEMAS } from "../utils/validacao";

const ok = (res: Response, dados: any, mensagem = "Sucesso") =>
  res.json(Respostas.sucesso(dados, mensagem));

const erro = (res: Response, status: number, mensagem: any) =>
  res.status(status).json(mensagem);

const idInvalido = (res: Response) =>
  erro(res, 400, Respostas.validacaoFalhou(["ID inválido"]));

const buscarLeitura = async (id: number) => {
  const { rows } = await pool.query(
    `
    SELECT l.*, s.nome_sensor, s.tipo_sensor, s.unidade_medida
    FROM leituras l
    JOIN sensores s ON s.id_sensor = l.id_sensor
    WHERE l.id_leitura = $1
    `,
    [id],
  );
  return rows[0];
};

//GET ALL
export const listarLeituras = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT l.*, s.nome_sensor, s.tipo_sensor, s.unidade_medida
      FROM leituras l
      JOIN sensores s ON s.id_sensor = l.id_sensor
      ORDER BY l.data_hora DESC
      `,
    );
    return ok(res, rows, "Leituras listadas com sucesso");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

//GET BY ID
export const buscarLeituraPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return idInvalido(res);

    const leitura = await buscarLeitura(id);
    if (!leitura) return erro(res, 404, Respostas.naoEncontrado("Leitura"));

    return ok(res, leitura, "Leitura encontrada");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

//POST
export const criarLeitura = async (req: Request, res: Response) => {
  try {
    const validacao = validarSchema(req.body, SCHEMAS.LEITURA);
    if (!validacao.valido)
      return erro(res, 400, Respostas.validacaoFalhou(validacao.erros));

    const { id_sensor, valor, valor_booleano } = req.body;

    const sensor = await pool.query(
      `SELECT 1 FROM sensores WHERE id_sensor = $1`,
      [id_sensor],
    );
    if (!sensor.rows.length)
      return erro(res, 404, Respostas.naoEncontrado("Sensor"));

    const { rows } = await pool.query(
      `
      INSERT INTO leituras (id_sensor, valor, valor_booleano)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id_sensor, valor ?? null, valor_booleano ?? null],
    );

    return res
      .status(201)
      .json(Respostas.criado(rows[0], "Leitura criada com sucesso"));
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};

//DELETE
export const deletarLeitura = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return idInvalido(res);

    const { rows } = await pool.query(
      `DELETE FROM leituras WHERE id_leitura = $1 RETURNING id_leitura`,
      [id],
    );

    if (!rows.length) return erro(res, 404, Respostas.naoEncontrado("Leitura"));
    return ok(res, null, "Leitura removida com sucesso");
  } catch (e: any) {
    console.error(e);
    return erro(res, 500, Respostas.erroInterno(e.message));
  }
};
