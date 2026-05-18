import { Router } from "express";

import {
  listarSensores,
  buscarSensorPorId,
} from "../controllers/sensoresController";

const router = Router();

router.get("/", listarSensores);
router.get("/:id", buscarSensorPorId);

export default router;
