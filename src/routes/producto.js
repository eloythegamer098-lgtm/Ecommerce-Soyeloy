import { Router } from "express";
import { obtenerProductos,crearProducto,actualizarProducto,eliminarProducto,obtenerProductosbyId, obtenerProductosRelacionados } from "../controllers/productos_controller.js";
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Middleware opcional para detectar usuario sin bloquear
const optionalToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer')) {
        return verifyToken(req, res, next);
    }
    next();
};

router.get("/", optionalToken, asynHandler(obtenerProductos));
router.get("/relacionados/:id", asynHandler(obtenerProductosRelacionados));
router.get("/:id", asynHandler(obtenerProductosbyId));

router.post("/",
    verifyToken,
    isAdmin,
    validarCampos(["categoria_id","nombre","descripcion","precio","stock"]),
    asynHandler(crearProducto)
);

router.put("/:id",
    verifyToken,
    isAdmin,
    asynHandler(actualizarProducto)
);

router.delete("/:id",
    verifyToken,
    isAdmin,
    asynHandler(eliminarProducto)
);


export default router;
