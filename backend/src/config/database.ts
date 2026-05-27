import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => {
    console.log("[DATABASE] PostgreSQL conectado com sucesso");
  })
  .catch((err) => {
    console.error("[DATABASE] Erro ao conectar:", err);
  });