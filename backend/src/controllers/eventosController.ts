import { Request, Response } from "express";
import { pool } from "../config/database";
import { Validacao } from "../utils/validacao";
import { Respostas } from "../utils/respostas";
import { AuthRequest } from "../middleware/autenticacao";

import { Evento } from "../models/eventoModel";

// GET ALL (Listagem protegida)
export const listarEventos = async (req: AuthRequest, res: Response) => {
  try {
    // Pegamos o id do usuário que veio embutido no token de autenticação (AuthRequest)
    // Eu fiz isso para garantir que apenas um usuário logado possa pedir os seus próprios eventos.
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) {
      return res.status(401).json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    // [SEGURANÇA] Antigamente, a API devolvia todos os eventos do banco. Eu identifiquei que isso causava um vazamento
    // de dados (ex: eventos de outros robôs apareciam para usuários normais). 
    // Eu resolvi isso usando um JOIN com a tabela 'dispositivos', garantindo que o usuário 
    // só receba alertas gerados pelos robôs que pertencem a ele mesmo (WHERE d.id_usuario = $1).
    const { rows } = await pool.query<Evento>(
      `SELECT e.id_evento, e.id_dispositivo, e.id_sensor, e.tipo_evento, e.nivel_criticidade, e.data_evento
       FROM eventos e
       JOIN dispositivos d ON d.id_dispositivo = e.id_dispositivo
       WHERE d.id_usuario = $1
       ORDER BY e.data_evento DESC`,
       [id_usuario]
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

// DELETE ALL (Limpar histórico do usuário logado)
// Esta função foi criada a pedido do usuário para permitir zerar o histórico de alertas.
export const limparEventos = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) {
      return res.status(401).json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    // [SEGURANÇA] Eu criei uma trava fundamental aqui: 
    // Não usei simplesmente um "DELETE FROM eventos", pois percebi que isso apagaria o histórico de todos os 
    // usuários do aplicativo. Em vez disso, eu construí uma subquery (IN SELECT...) que garante que só serão apagados
    // os eventos atrelados aos dispositivos do usuário logado ($1).
    const { rowCount } = await pool.query(
      `DELETE FROM eventos 
       WHERE id_dispositivo IN (
         SELECT id_dispositivo FROM dispositivos WHERE id_usuario = $1
       )`,
      [id_usuario],
    );

    // Retorna a quantidade de alertas removidos dinamicamente (rowCount)
    return res.json(Respostas.sucesso(null, `Histórico limpo com sucesso. ${rowCount} alertas removidos.`));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
