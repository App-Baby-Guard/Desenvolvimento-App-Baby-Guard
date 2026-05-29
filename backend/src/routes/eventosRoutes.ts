import { Router } from "express";

import {
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  deletarEvento,
  limparEventos,
} from "../controllers/eventosController";

const router = Router();

router.get("/", listarEventos);
router.get("/:id", buscarEventoPorId);
router.post("/", criarEvento);
router.delete("/limpar/todos", limparEventos);
router.delete("/:id", deletarEvento);

export default router;
