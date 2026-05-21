import { Router } from "express";

import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuariosController";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", criarUsuario);
router.patch("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);
export default router;
