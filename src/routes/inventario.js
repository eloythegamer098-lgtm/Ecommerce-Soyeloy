import { Router } from "express";
import { obtenerHistorialStock, ajustarStock } from "../controllers/inventario_controller.js";
import { asynHandler } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/historial", verifyToken, isAdmin, asynHandler(obtenerHistorialStock));
router.post("/ajustar/:id", verifyToken, isAdmin, asynHandler(ajustarStock));

export default router;
