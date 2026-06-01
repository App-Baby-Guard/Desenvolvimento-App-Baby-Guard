import { Router } from "express";
import { testarBlynk } from "../controllers/blynkController";

const router = Router();

router.get("/teste/:token", testarBlynk);

export default router;
