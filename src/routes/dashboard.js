import { Router } from "express";
import { obtenerEstadisticas, obtenerReporteVentas } from "../controllers/dashboard_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/stats", verifyToken, isAdmin, obtenerEstadisticas);
router.get("/reports/sales", verifyToken, isAdmin, obtenerReporteVentas);

export default router;
