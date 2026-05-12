import { Router } from "express";
import { realizarPedido, obtenerPedidos } from "../controllers/pedidos_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/realizarPedido",verifyToken, realizarPedido);
router.get("/obtenerPedidos",verifyToken, obtenerPedidos);

export default router;