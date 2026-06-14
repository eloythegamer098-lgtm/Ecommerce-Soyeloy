import { Router } from "express";
import { validarCupon, listarCupones, crearCupon, desactivarCupon } from "../controllers/cupones_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.get("/validar/:codigo", verifyToken, asynHandler(validarCupon));
router.get("/admin/listar", verifyToken, isAdmin, asynHandler(listarCupones));
router.post("/admin/crear", verifyToken, isAdmin, asynHandler(crearCupon));
router.delete("/admin/:id", verifyToken, isAdmin, asynHandler(desactivarCupon));

export default router;
