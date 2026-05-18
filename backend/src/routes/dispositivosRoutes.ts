import { Router } from "express";
import {
  listarDispositivos,
  criarDispositivo,
} from "../controllers/dispositivosController";

export default Router()
  .get("/", listarDispositivos)
  .post("/", criarDispositivo);
