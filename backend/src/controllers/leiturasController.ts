import { Request, Response } from "express";
import { pool } from "../config/database";
import { Respostas } from "../utils/respostas";
import { AuthRequest } from "../middleware/autenticacao";

import { Leitura } from "../models/leituraModel";

// GET ALL (Com proteção de isolamento de usuário)
export const listarLeituras = async (req: AuthRequest, res: Response) => {
  try {
    // Pegamos a identidade de quem fez a requisição para isolar os dados
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) {
      return res.status(401).json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    // [SEGURANÇA] Antes dessa correção, eu notei que ocorria um vazamento: um usuário conseguia ver as leituras 
    // de todos os sensores do banco (inclusive os de dispositivos de outras contas). 
    // Para resolver, eu adicionei dois JOINs (com 'sensores' e 'dispositivos') para checar 
    // o dono real do aparelho. Assim, o WHERE garante que as leituras enviadas 
    // são exclusivas do id_usuario que fez a requisição.
    const { rows } = await pool.query<Leitura>(
      `SELECT l.id_leitura, l.id_sensor, l.valor, l.valor_booleano, l.movimento, l.data_hora
       FROM leituras l
       JOIN sensores s ON s.id_sensor = l.id_sensor
       JOIN dispositivos d ON d.id_dispositivo = s.id_dispositivo
       WHERE d.id_usuario = $1
       ORDER BY l.data_hora DESC`,
       [id_usuario]
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

// GET últimas leituras de cada sensor de um dispositivo
export const buscarUltimasLeiturasPorDispositivo = async (req: Request, res: Response) => {
  try {
    const id_dispositivo = Number(req.params.id_dispositivo);

    if (isNaN(id_dispositivo)) {
      return res.status(400).json(Respostas.validacaoFalhou(["ID do dispositivo inválido"]));
    }

    const { rows } = await pool.query(
      `SELECT DISTINCT ON (s.id_sensor)
        s.id_sensor, s.tipo_sensor, s.unidade_medida, s.nome_sensor,
        l.valor, l.valor_booleano, l.movimento, l.data_hora
       FROM sensores s
       JOIN leituras l ON l.id_sensor = s.id_sensor
       WHERE s.id_dispositivo = $1
       ORDER BY s.id_sensor, l.data_hora DESC`,
      [id_dispositivo],
    );

    return res
      .status(200)
      .json(
        Respostas.sucesso(
          { quantidade: rows.length, leituras: rows },
          "Últimas leituras do dispositivo",
        ),
      );
  } catch (error: any) {
    console.error("Erro ao buscar leituras do dispositivo:", error);
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// DELETE ALL (Limpar histórico do usuário logado)
// A função de apagar histórico foi um pedido de feature. Isso remove o "lixo" acumulado por testes.
export const limparLeituras = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) {
      return res.status(401).json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    // [SEGURANÇA] Eu estruturei essa Query usando subconsultas em cascata para chegar ao dono final:
    // 1. Descobre os dispositivos do id_usuario.
    // 2. Descobre os sensores desses dispositivos.
    // 3. Deleta somente as leituras ligadas a esses sensores específicos.
    // Eu fiz isso para que o Frontend possa acionar essa rota na tela "Alertas" e limpar o histórico com segurança.
    const { rowCount } = await pool.query(
      `DELETE FROM leituras 
       WHERE id_sensor IN (
         SELECT id_sensor FROM sensores WHERE id_dispositivo IN (
           SELECT id_dispositivo FROM dispositivos WHERE id_usuario = $1
         )
       )`,
      [id_usuario],
    );

    return res.json(Respostas.sucesso(null, `Histórico de leituras limpo com sucesso. ${rowCount} registros removidos.`));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};
