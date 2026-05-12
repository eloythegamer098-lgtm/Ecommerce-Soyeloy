import { Router } from "express";
import { obtenerProductos,crearProducto } from "../controllers/productos_controller.js";
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/",asynHandler(obtenerProductos));

router.post("/",
verifyToken,
validarCampos(["categoria_id","nombre","descripcion","precio","stock"]),
asynHandler(crearProducto)
)

router.put("/:id",asynHandler((req,res) => {
    res.json({message:"Producto actualizado"});
}))


export default router;
