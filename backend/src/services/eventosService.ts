import { pool } from "../config/database";

export class EventoService {
  //GET ALL
  static async listarTodos() {
    const { rows } = await pool.query(`
      SELECT e.*, d.nome_dispositivo, s.nome_sensor, s.tipo_sensor
      FROM eventos e
      JOIN dispositivos d ON d.id_dispositivo = e.id_dispositivo
      LEFT JOIN sensores s ON s.id_sensor = e.id_sensor
      ORDER BY e.data_evento DESC
    `);
    return rows;
  }

  //GET BY ID
  static async buscarPorId(id: number) {
    const { rows } = await pool.query(
      `
      SELECT e.*, d.nome_dispositivo, s.nome_sensor, s.tipo_sensor
      FROM eventos e
      JOIN dispositivos d ON d.id_dispositivo = e.id_dispositivo
      LEFT JOIN sensores s ON s.id_sensor = e.id_sensor
      WHERE e.id_evento = $1
    `,
      [id],
    );
    return rows[0];
  }

  static async listarPorDispositivo(id_dispositivo: number) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM eventos
      WHERE id_dispositivo = $1
      ORDER BY data_evento DESC
    `,
      [id_dispositivo],
    );
    return rows;
  }

  static async listarCriticos() {
    const { rows } = await pool.query(`
      SELECT *
      FROM eventos
      WHERE nivel_criticidade IN ('alto', 'critico')
      ORDER BY data_evento DESC
    `);
    return rows;
  }

  //POST
  static async criar(data: any) {
    const dispositivo = await pool.query(
      `SELECT 1 FROM dispositivos WHERE id_dispositivo = $1`,
      [data.id_dispositivo],
    );
    if (!dispositivo.rows.length) throw new Error("DISPOSITIVO_NAO_ENCONTRADO");

    if (data.id_sensor) {
      const sensor = await pool.query(
        `SELECT 1 FROM sensores WHERE id_sensor = $1`,
        [data.id_sensor],
      );
      if (!sensor.rows.length) throw new Error("SENSOR_NAO_ENCONTRADO");
    }

    const { rows } = await pool.query(
      `
      INSERT INTO eventos (id_dispositivo, id_sensor, tipo_evento, nivel_criticidade)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [
        data.id_dispositivo,
        data.id_sensor || null,
        data.tipo_evento,
        data.nivel_criticidade,
      ],
    );

    return rows[0];
  }

  static async atualizar(id: number, data: any) {
    const evento = await this.buscarPorId(id);
    if (!evento) throw new Error("EVENTO_NAO_ENCONTRADO");

    const { rows } = await pool.query(
      `
      UPDATE eventos
      SET tipo_evento = COALESCE($1, tipo_evento),
          nivel_criticidade = COALESCE($2, nivel_criticidade)
      WHERE id_evento = $3
      RETURNING *
    `,
      [data.tipo_evento, data.nivel_criticidade, id],
    );

    return rows[0];
  }

  //DELETE
  static async deletar(id: number) {
    const evento = await this.buscarPorId(id);
    if (!evento) throw new Error("EVENTO_NAO_ENCONTRADO");

    await pool.query(`DELETE FROM eventos WHERE id_evento = $1`, [id]);
    return { deletado: true };
  }
}
