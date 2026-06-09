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

    if (!uuid_dispositivo) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Código do dispositivo (UUID) é obrigatório"]));
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

    // Busca o dispositivo pelo UUID fornecido pelo aplicativo
    const dispositivoExistente = await pool.query(
      `SELECT id_dispositivo, id_usuario FROM dispositivos WHERE uuid_dispositivo = $1`,
      [uuid_dispositivo],
    );

    // Se não existir, impede o cadastro dinâmico
    if (dispositivoExistente.rows.length === 0) {
      return res
        .status(404)
        .json(Respostas.naoEncontrado("Código do dispositivo inválido ou não reconhecido pela fábrica."));
    }

    const dispositivo = dispositivoExistente.rows[0];

    if (
      dispositivo.id_usuario !== null &&
      dispositivo.id_usuario !== id_usuario
    ) {
      return res.status(409).json(
        Respostas.conflito(
          "Este robô já está vinculado a outra conta e não pode ser cadastrado novamente.",
        ),
      );
    }

    // CLAIM DEVICE: Associa o usuário ao hardware já existente
    const { rows } = await pool.query<Dispositivo>(
      `UPDATE dispositivos
       SET id_usuario = $1, nome_dispositivo = $2
       WHERE uuid_dispositivo = $3
       RETURNING id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
                 token_dispositivo, status_dispositivo, ativo, criado_em`,
      [id_usuario, Validacao.sanitizarString(nome_dispositivo), uuid_dispositivo],
    );

    return res
      .status(201)
      .json(Respostas.sucesso(rows[0], "Dispositivo pareado com sucesso"));
  } catch (error: any) {
    return res.status(500).json(Respostas.erroInterno(error.message));
  }
};

// PATCH (atualiza/renomeia dispositivo e muda status de conexão)
export const atualizarDispositivo = async (req: AuthRequest, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    const { uuid } = req.params;
    
    // Agora aceitamos tanto o nome quanto o status do dispositivo
    const { nome_dispositivo, status_dispositivo } = req.body;

    if (!id_usuario) {
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Usuário não autenticado"));
    }

    if (!nome_dispositivo && !status_dispositivo) {
      return res
        .status(400)
        .json(Respostas.validacaoFalhou(["Nenhum dado para atualizar"]));
    }

    // [QUERY BUILDER DINÂMICO]
    // Eu implementei isso porque percebi que o usuário pode querer apenas renomear o robô pelo app,
    // OU o dispositivo de hardware (placa) pode querer apenas avisar que ficou 'online'/'offline'.
    // Para evitar a criação de duas rotas separadas fazendo quase a mesma coisa, eu construí a query SQL 
    // "sob medida", montando os campos de atualização dinamicamente baseados no que foi recebido.
    let updates = [];
    let params = [];
    let i = 1; // Contador para os $1, $2 do Postgres

    if (nome_dispositivo) {
      updates.push(`nome_dispositivo = $${i++}`);
      params.push(Validacao.sanitizarString(nome_dispositivo));
    }
    if (status_dispositivo) {
      updates.push(`status_dispositivo = $${i++}`);
      params.push(status_dispositivo);
    }

    // Adiciona os filtros obrigatórios no final do array de parâmetros
    params.push(uuid);
    params.push(id_usuario);

    const { rows } = await pool.query<Dispositivo>(
      `UPDATE dispositivos
       SET ${updates.join(", ")}
       WHERE uuid_dispositivo = $${i} AND id_usuario = $${i + 1} AND ativo = true
       RETURNING id_dispositivo, uuid_dispositivo, id_usuario, nome_dispositivo,
                 token_dispositivo, status_dispositivo, ativo, criado_em`,
      params,
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
