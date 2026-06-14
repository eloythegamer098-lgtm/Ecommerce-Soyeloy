import { Router } from "express";
import { realizarPedido, obtenerPedidos, obtenerDetallePedido, listarTodosLosPedidos, actualizarEstadoPedido } from "../controllers/pedidos_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Rutas de Usuario
router.post("/realizarPedido", verifyToken, realizarPedido);
router.get("/obtenerPedidos", verifyToken, obtenerPedidos);
router.get("/detallePedidos/:id", verifyToken, obtenerDetallePedido);

// Rutas de Admin
router.get("/admin/todos", verifyToken, isAdmin, listarTodosLosPedidos);
router.put("/admin/estado/:id", verifyToken, isAdmin, actualizarEstadoPedido);

export default router;