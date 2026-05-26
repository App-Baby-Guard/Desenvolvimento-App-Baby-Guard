import { Router } from "express";
import {
  listarDispositivos,
  criarDispositivo,
  atualizarDispositivo,
  deletarDispositivo,
} from "../controllers/dispositivosController";

export default Router()
  .get("/", listarDispositivos)
  .post("/", criarDispositivo)
  .patch("/:uuid", atualizarDispositivo)
  .delete("/:uuid", deletarDispositivo);
