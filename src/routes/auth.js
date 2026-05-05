import { Router } from "express";
import {eventos } from "../events/sistemaEventos.js"
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";
import pool from '../bd/connection.js'
import bcrypt from 'bcryptjs'

const router = Router();

router.post("/registro",
validarCampos(["nombre","email","password"]),
asynHandler(async (req,res) => {
    const {nombre,email,password} = req.body;

    const[usuariosPrevios] = await pool.query("SELECT id FROM usuarios WHERE email = ?",[email]);
    if(usuariosPrevios.length > 0){
        return res.status(409).json({
            error:'Email ya esta registrado'
        });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const [resultado]= await pool.query(
        "INSERT INTO usuarios(nombre,email,password) VALUES (?,?,?)",
        [nombre,email,hashPassword]
    );


    const nuevoUsuario = {id:resultado.insertId,nombre,email}
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