import { Router } from "express";
import { obtenerAjustes, actualizarAjustes, obtenerAjustePorClave } from "../controllers/configuracion_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { asynHandler } from "../middlewares/avanzado.js";

const router = Router();

// Ruta pública para obtener ajustes específicos (ej: nombre de tienda)
router.get("/publico/:clave", asynHandler(obtenerAjustePorClave));

// Rutas de Admin
router.get("/admin/listar", verifyToken, isAdmin, asynHandler(obtenerAjustes));
router.put("/admin/actualizar", verifyToken, isAdmin, asynHandler(actualizarAjustes));

export default router;
