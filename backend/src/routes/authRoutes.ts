import { Router } from "express";
import * as AuthController from "../controllers/authController";
import { autenticacao } from "../middleware/autenticacao";

const router = Router();

// Rotas públicas
router.post("/registro", AuthController.registro);
router.post("/login", AuthController.login);

// Rotas privadas
router.post("/logout", autenticacao, AuthController.logout);
router.get("/validar", autenticacao, AuthController.validarToken);

export default router;
