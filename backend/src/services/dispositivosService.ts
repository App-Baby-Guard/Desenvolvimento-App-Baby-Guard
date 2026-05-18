import { pool } from "../config/database";

export class DispositivoService {
  //GET ALL
  static async listarTodos() {
    const { rows } = await pool.query(`
      SELECT d.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM dispositivos d
      JOIN usuarios u ON u.id_usuario = d.id_usuario
      ORDER BY d.id_dispositivo
    `);
    return rows;
  }

  //GET BY ID
  static async buscarPorId(id: number) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM dispositivos
      WHERE id_dispositivo = $1
    `,
      [id],
    );
    return rows[0];
  }

  static async listarPorUsuario(id_usuario: number) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM dispositivos
      WHERE id_usuario = $1
      ORDER BY id_dispositivo
    `,
      [id_usuario],
    );
    return rows;
  }

  //POST
  static async criar(data: any) {
    const usuario = await pool.query(
      `SELECT 1 FROM usuarios WHERE id_usuario = $1`,
      [data.id_usuario],
    );
    if (!usuario.rows.length) throw new Error("USUARIO_NAO_ENCONTRADO");

    const { rows } = await pool.query(
      `
      INSERT INTO dispositivos (
        id_usuario, nome_dispositivo, wifi_ssid, token_dispositivo, status_dispositivo, movimento
      ) VALUES ($1, $2, $3, $4, 'offline', false)
      RETURNING *
    `,
      [
        data.id_usuario,
        data.nome_dispositivo,
        data.wifi_ssid || null,
        data.token_dispositivo || null,
      ],
    );

    return rows[0];
  }

  static async atualizar(id: number, data: any) {
    const existe = await this.buscarPorId(id);
    if (!existe) throw new Error("DISPOSITIVO_NAO_ENCONTRADO");

    const { rows } = await pool.query(
      `
      UPDATE dispositivos
      SET
        nome_dispositivo = COALESCE($1, nome_dispositivo),
        wifi_ssid = COALESCE($2, wifi_ssid),
        token_dispositivo = COALESCE($3, token_dispositivo),
        status_dispositivo = COALESCE($4, status_dispositivo),
        movimento = COALESCE($5, movimento)
      WHERE id_dispositivo = $6
      RETURNING *
    `,
      [
        data.nome_dispositivo,
        data.wifi_ssid,
        data.token_dispositivo,
        data.status_dispositivo,
        data.movimento,
        id,
      ],
    );

    return rows[0];
  }

  static async atualizarStatus(
    id: number,
    status_dispositivo: string,
    movimento?: boolean,
  ) {
    const existe = await this.buscarPorId(id);
    if (!existe) throw new Error("DISPOSITIVO_NAO_ENCONTRADO");

    const { rows } = await pool.query(
      `
      UPDATE dispositivos
      SET status_dispositivo = $1, movimento = COALESCE($2, movimento)
      WHERE id_dispositivo = $3
      RETURNING *
    `,
      [status_dispositivo, movimento, id],
    );

    return rows[0];
  }

  //DELETE
  static async remover(id: number) {
    const existe = await this.buscarPorId(id);
    if (!existe) throw new Error("DISPOSITIVO_NAO_ENCONTRADO");

    await pool.query(`DELETE FROM dispositivos WHERE id_dispositivo = $1`, [
      id,
    ]);
    return { deletado: true };
  }
}
