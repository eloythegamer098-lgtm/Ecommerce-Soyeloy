import { Router } from "express";
import {eventos } from "../events/sistemaEventos.js"
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";

const router = Router();

let usuarios = [];

router.post("/registro",
validarCampos(["nombre","email","password"]),
asynHandler(async (req,res) => {
    const {nombre,email} = req.body;
    const nuevoUsuario = {id:Date.now(),nombre,email}
    usuarios.push(nuevoUsuario);
    eventos.emit("usuario:registrado",nuevoUsuario)
    res.status(201).json({
        mensaje:"Registro exitoso",datos:nuevoUsuario
    })
})
)

router.post("/login",
validarCampos(["email"]),(req,res) => {
    const usuario = usuarios.find(u => u.email === req.body.email)
    if(!usuario) return res.status(401).json({error:"Credenciales invalidas"})
        eventos.emit("usuario:login",{email:usuario.email})
    res.json({token: 'fake-jwt-token-${Date.now()}',usuario})
})

export default router;