import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/database";
import { Respostas } from "../utils/respostas";
import { validarSchema, SCHEMAS, Validacao } from "../utils/validacao";

const send = (res: Response, status: number, data: any) =>
  res.status(status).json(data);

const error = (res: Response, err: any) => {
  console.error(err);
  return send(res, 500, Respostas.erroInterno(err.message));
};

const getId = (id: string) => Number(id);
const formatEmail = (email: string) => email.toLowerCase().trim();

const usuarioSelect = `
  id_usuario,
  nome,
  email,
  telefone,
  foto_perfil,
  push_token,
  status_usuario,
  criado_em
`;

//GET ALL
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const totalQuery = await pool.query(
      `SELECT COUNT(*)::INT AS total FROM usuarios`,
    );
    const total = totalQuery.rows[0].total;

    const { rows } = await pool.query(
      `SELECT ${usuarioSelect} FROM usuarios ORDER BY id_usuario DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return send(res, 200, Respostas.paginado(rows, page, limit, total));
  } catch (err: any) {
    return error(res, err);
  }
};

//GET BY ID
export const buscarUsuarioPorId = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    if (isNaN(id))
      return send(res, 400, Respostas.validacaoFalhou(["ID inválido"]));

    const { rows } = await pool.query(
      `SELECT ${usuarioSelect} FROM usuarios WHERE id_usuario = $1`,
      [id],
    );

    if (!rows.length) return send(res, 404, Respostas.naoEncontrado("Usuário"));
    return send(res, 200, Respostas.sucesso(rows[0], "Usuário encontrado"));
  } catch (err: any) {
    return error(res, err);
  }
};

//POST
export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const validacao = validarSchema(req.body, SCHEMAS.REGISTRO);
    if (!validacao.valido)
      return send(res, 400, Respostas.validacaoFalhou(validacao.erros));

    const { nome, email, password, telefone } = req.body;
    const emailFormatado = formatEmail(email);

    const usuarioExiste = await pool.query(
      `SELECT 1 FROM usuarios WHERE email = $1`,
      [emailFormatado],
    );
    if (usuarioExiste.rows.length)
      return send(res, 409, Respostas.conflito("Email já cadastrado"));

    const senhaHash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `
      INSERT INTO usuarios (nome, email, senha_hash, telefone, status_usuario, criado_em)
      VALUES ($1, $2, $3, $4, 'ativo', CURRENT_TIMESTAMP)
      RETURNING ${usuarioSelect}
      `,
      [
        Validacao.sanitizarString(nome),
        emailFormatado,
        senhaHash,
        telefone || null,
      ],
    );

    return send(
      res,
      201,
      Respostas.criado(rows[0], "Usuário criado com sucesso"),
    );
  } catch (err: any) {
    return error(res, err);
  }
};

//DELETE
export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    const id = getId(req.params.id);
    if (isNaN(id))
      return send(res, 400, Respostas.validacaoFalhou(["ID inválido"]));

    const { rowCount } = await pool.query(
      `DELETE FROM usuarios WHERE id_usuario = $1`,
      [id],
    );
    if (!rowCount) return send(res, 404, Respostas.naoEncontrado("Usuário"));

    return send(
      res,
      200,
      Respostas.sucesso(null, "Usuário deletado com sucesso"),
    );
  } catch (err: any) {
    return error(res, err);
  }
};
