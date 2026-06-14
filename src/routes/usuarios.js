import { Router } from "express";
import { listarUsuarios, cambiarRol, eliminarUsuario } from "../controllers/usuarios_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", verifyToken, isAdmin, listarUsuarios);
router.get("/all", verifyToken, isAdmin, listarUsuarios);
router.put("/rol/:id", verifyToken, isAdmin, cambiarRol);
router.delete("/:id", verifyToken, isAdmin, eliminarUsuario);

export default router;
