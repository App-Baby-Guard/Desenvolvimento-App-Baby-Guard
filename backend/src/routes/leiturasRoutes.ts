import { Router } from "express";

import {
  listarLeituras,
  criarLeitura,
  buscarLeituraPorId,
  deletarLeitura,
} from "../controllers/leiturasController";

const router = Router();

router.get("/", listarLeituras);
router.get("/:id", buscarLeituraPorId);
router.post("/", criarLeitura);
router.delete("/:id", deletarLeitura);

export default router;
