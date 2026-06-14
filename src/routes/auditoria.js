import { Router } from "express";
import { listarAuditoria, obtenerLogDetalle } from "../controllers/auditoria_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.get("/listar", verifyToken, isAdmin, asynHandler(listarAuditoria));
router.get("/:id", verifyToken, isAdmin, asynHandler(obtenerLogDetalle));

export default router;
