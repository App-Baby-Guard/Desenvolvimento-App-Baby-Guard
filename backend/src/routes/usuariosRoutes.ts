import { Router } from "express";

import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  deletarUsuario,
} from "../controllers/usuariosController";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", criarUsuario);
router.delete("/:id", deletarUsuario);
export default router;
