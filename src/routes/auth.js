    import { Router } from "express";
    import {eventos } from "../events/sistemaEventos.js"
    import { validarCampos, asynHandler, registroRules, loginRules, validate } from "../middlewares/avanzado.js";
    import pool from '../bd/connection.js'
    import bcrypt from 'bcryptjs'
    import jwt from 'jsonwebtoken'
    import { verifyToken } from "../middlewares/verifyToken.js";
    import { enviarEmail, templates } from "../services/emailService.js";
    import crypto from 'crypto';
    import { registrarAuditoria } from "../services/auditService.js";

    const router = Router();

    router.post("/registro",
    registroRules,
    validate,
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
            "INSERT INTO usuarios(nombre,email,password,rol) VALUES (?,?,?,?)",
            [nombre,email,hashPassword,'user']
        );


        const nuevoUsuario = {id:resultado.insertId,nombre,email,rol:'user'}
        eventos.emit("usuario:registrado",nuevoUsuario)
        
        // Enviar email de bienvenida (No bloquea la respuesta)
        enviarEmail(email, "¡Bienvenido a Neon Store! 🚀", templates.bienvenida(nombre)).catch(console.error);

        res.status(201).json({
            mensaje:"Registro exitoso",datos:nuevoUsuario
        })
    })
    )

    // Recuperar Contraseña - Solicitar Token
    router.post("/forgot-password", 
    validarCampos(["email"]), 
    asynHandler(async (req, res) => {
        const { email } = req.body;
        const [users] = await pool.query("SELECT id, nombre FROM usuarios WHERE email = ?", [email]);

        if (users.length === 0) {
            // Por seguridad, no revelamos si el email existe o no
            return res.json({ mensaje: "Si el email existe, se ha enviado un enlace de recuperación." });
        }

        const user = users[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expira = new Date(Date.now() + 3600000); // 1 hora

        await pool.query(
            "INSERT INTO password_resets (usuario_id, token, expira_at) VALUES (?, ?, ?)",
            [user.id, token, expira]
        );

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        
        await enviarEmail(email, "Recuperación de Contraseña - Neon Store", templates.recuperacion(user.nombre, resetLink));

        res.json({ mensaje: "Si el email existe, se ha enviado un enlace de recuperación." });
    }));

    // Restablecer Contraseña con Token
    router.post("/reset-password",
    validarCampos(["token", "newPassword"]),
    asynHandler(async (req, res) => {
        const { token, newPassword } = req.body;

        const [results] = await pool.query(
            "SELECT usuario_id FROM password_resets WHERE token = ? AND utilizado = 0 AND expira_at > NOW()",
            [token]
        );

        if (results.length === 0) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }

        const userId = results[0].usuario_id;
        const hashPassword = await bcrypt.hash(newPassword, 12);

        // Actualizar contraseña y marcar token como usado en una transacción
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query("UPDATE usuarios SET password = ? WHERE id = ?", [hashPassword, userId]);
            await connection.query("UPDATE password_resets SET utilizado = 1 WHERE token = ?", [token]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

        res.json({ mensaje: "Contraseña actualizada exitosamente" });
    }));

    router.post("/login",
    loginRules,
    validate,
    asynHandler(async (req,res) => {
        const {email,password} = req.body;
        const[rows] = await pool.query("SELECT * FROM usuarios WHERE email = ? ",[email]);
        if(rows.length === 0){
            return res.status(401).json({error: "Credenciales son invalidas o no existe el usuario creado"});

        }
        const usuario = rows[0];
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if(!passwordValido){
            return res.status(401).json({error: "Credenciales son invalidas o no existe el usuario creado"});
        }
        const token = jwt.sign(
            {id:usuario.id,email:usuario.email,nombre:usuario.nombre,rol:usuario.rol},
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        );
        
    eventos.emit("usuarios:login",{usuario: usuario.email});

    // Auditoría: Registrar inicio de sesión administrativo
    if (usuario.rol === 'admin') {
        await registrarAuditoria(usuario.id, 'LOGIN_ADMIN', 'usuarios', usuario.id, { 
            ip: req.ip, 
            user_agent: req.get('User-Agent') 
        });
    }

    res.json({
        mensaje: "Login Exitoso",
        token: token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        }
    });

    }));

    router.get("/perfil",verifyToken,asynHandler(async(req,res) =>{
            const [ rows] = await pool.query("SELECT id,nombre,email,rol,creado_en FROM usuarios WHERE id = ?",[req.usuario.id]);
            if(rows.length === 0){
                return res.status(404).json({
                    error:"USUARIO NO ENCONTRADO"
                });

            }

            res.json({perfil:rows[0]});


        }));

    export default router;