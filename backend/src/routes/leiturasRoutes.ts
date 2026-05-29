import { Router } from "express";

import {
  listarLeituras,
  criarLeitura,
  buscarLeituraPorId,
  deletarLeitura,
  buscarUltimasLeiturasPorDispositivo,
  limparLeituras,
} from "../controllers/leiturasController";

const router = Router();

router.get("/", listarLeituras);
router.get("/dispositivo/:id_dispositivo", buscarUltimasLeiturasPorDispositivo);
router.get("/:id", buscarLeituraPorId);
router.post("/", criarLeitura);
router.delete("/limpar/todos", limparLeituras);
router.delete("/:id", deletarLeitura);

export default router;
