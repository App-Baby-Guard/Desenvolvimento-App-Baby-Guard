// src/server.ts
import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { iniciarSincronizacaoAutomatica } from "./services/blynkSyncService";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  
  console.log("[WORKER] Iniciando rotina de sincronização automática com Blynk (10s)...");
  iniciarSincronizacaoAutomatica();
});
