import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

console.log("[DATABASE_URL]:", process.env.DATABASE_URL);

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
