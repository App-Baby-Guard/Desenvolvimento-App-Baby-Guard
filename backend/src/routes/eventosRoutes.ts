import { Router } from "express";

import {
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  deletarEvento,
} from "../controllers/eventosController";

const router = Router();

router.get("/", listarEventos);
router.get("/:id", buscarEventoPorId);
router.post("/", criarEvento);
router.delete("/:id", deletarEvento);
export default router;
