import { Router } from "express";

import {
  listarSensores,
  buscarSensorPorId,
  criarSensor,
  deletarSensor,
} from "../controllers/sensoresController";

const router = Router();

router.get("/", listarSensores);
router.get("/:id", buscarSensorPorId);
router.post("/", criarSensor);
router.delete("/:id", deletarSensor);

export default router;
