import { Router } from "express";
import { obtenerProductos,crearProducto,actualizarProducto,eliminarProducto } from "../controllers/productos_controller.js";
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/",asynHandler(obtenerProductos));

router.post("/",
verifyToken,
validarCampos(["categoria_id","nombre","descripcion","precio","stock"]),
asynHandler(crearProducto)
)

router.put("/:id",asynHandler(actualizarProducto));
router.delete("/:id",asynHandler(eliminarProducto));


export default router;
