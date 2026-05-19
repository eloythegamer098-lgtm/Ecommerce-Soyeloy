import { Router } from "express";
import { realizarPedido, obtenerPedidos, obtenerDetallePedido } from "../controllers/pedidos_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/realizarPedido",verifyToken, realizarPedido);
router.get("/obtenerPedidos",verifyToken, obtenerPedidos);
router.get("/detallePediddos/:id",verifyToken,obtenerDetallePedido);


export default router;