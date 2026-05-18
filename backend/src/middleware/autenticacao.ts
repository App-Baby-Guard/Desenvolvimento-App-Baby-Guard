import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { tokenEstaNaBlacklist } from "./tokenBlacklist";
import { Respostas } from "../utils/respostas";

const JWT_SECRET = process.env.JWT_SECRET || "babyguard_esp32_secure_2026";

// Interface do token
export interface UsuarioToken {
  id_usuario: number;
  email: string;
}

// Request autenticada
export interface AuthRequest extends Request {
  usuario?: UsuarioToken;
}

// Gerar token
export const gerarToken = (id_usuario: number, email: string): string =>
  jwt.sign({ id_usuario, email }, JWT_SECRET, { expiresIn: "7d" });

// Middleware de autenticação
export const autenticacao = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Token não informado"));

    const partes = authHeader.split(" ");
    if (partes.length !== 2 || partes[0] !== "Bearer")
      return res
        .status(401)
        .json(Respostas.naoAutorizado("Formato do token inválido"));

    const token = partes[1];

    if (tokenEstaNaBlacklist(token))
      return res.status(401).json(Respostas.naoAutorizado("Token expirado"));

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & UsuarioToken;
    req.usuario = {
      id_usuario: Number(decoded.id_usuario),
      email: decoded.email,
    };

    next();
  } catch {
    return res
      .status(401)
      .json(Respostas.naoAutorizado("Token inválido ou expirado"));
  }
};
