import { Router } from "express";
import { obtenerValoracionesProducto, guardarValoracion, miValoracion } from "../controllers/valoraciones_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.get("/producto/:producto_id", asynHandler(obtenerValoracionesProducto));
router.post("/guardar", verifyToken, asynHandler(guardarValoracion));
router.get("/mi-valoracion/:producto_id", verifyToken, asynHandler(miValoracion));

export default router;
