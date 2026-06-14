import { Router } from "express";
import { obtenerCategorias,crearCategoria,actualizarCategoria,eliminarCategoria } from "../controllers/categoria_controller.js";
import { validarCampos,asynHandler } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/obtenerCategorias", asynHandler(obtenerCategorias));

router.post("/crearCategoria", 
    verifyToken, 
    isAdmin, 
    validarCampos(["nombre"]), 
    asynHandler(crearCategoria)
);

router.put("/actualizarCategoria/:id", 
    verifyToken, 
    isAdmin, 
    asynHandler(actualizarCategoria)
);

router.delete("/eliminarCategoria/:id", 
    verifyToken, 
    isAdmin, 
    asynHandler(eliminarCategoria)
);


export default router;