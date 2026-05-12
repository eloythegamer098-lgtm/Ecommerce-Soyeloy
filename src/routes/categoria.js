import { Router } from "express";
import { obtenerCategorias } from "../controllers/categoria_controller.js";
import { validarCampos,asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.get("/obtenerCategorias",asynHandler(obtenerCategorias));

export default router;