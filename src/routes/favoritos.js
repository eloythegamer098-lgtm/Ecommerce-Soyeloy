import { Router } from "express";
import { obtenerFavoritos, toggleFavorito, esFavorito } from "../controllers/favoritos_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.get("/", verifyToken, asynHandler(obtenerFavoritos));
router.post("/toggle", verifyToken, asynHandler(toggleFavorito));
router.get("/check/:id", verifyToken, asynHandler(esFavorito));

export default router;
