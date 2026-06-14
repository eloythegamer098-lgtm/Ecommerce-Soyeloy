import pool from "../bd/connection.js";
import { registrarAuditoria } from "../services/auditService.js";

// Listar todos los usuarios (Solo Admin)
export const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY creado_en DESC");
        res.json({ total: rows.length, usuarios: rows });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

// Cambiar rol de usuario (Solo Admin)
export const cambiarRol = async (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['admin', 'user'].includes(rol)) {
        return res.status(400).json({ error: "Rol no válido" });
    }

    try {
        // Evitar que el admin se quite el rol a sí mismo (opcional pero recomendado)
        if (req.usuario.id == id && rol !== 'admin') {
            return res.status(403).json({ error: "No puedes quitarte el rol de administrador a ti mismo" });
        }

        // Obtener estado anterior para auditoría
        const [anterior] = await pool.query("SELECT rol FROM usuarios WHERE id = ?", [id]);

        const [resultado] = await pool.query("UPDATE usuarios SET rol = ? WHERE id = ?", [rol, id]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Registrar auditoría
        await registrarAuditoria(req.usuario.id, 'CAMBIAR_ROL', 'usuarios', id, { 
            antes: anterior[0]?.rol, 
            despues: rol 
        });

        res.json({ mensaje: "Rol actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar rol" });
    }
};

// Eliminar usuario (Solo Admin)
export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        if (req.usuario.id == id) {
            return res.status(403).json({ error: "No puedes eliminar tu propia cuenta" });
        }

        // Obtener datos antes de borrar para auditoría
        const [usuario] = await pool.query("SELECT nombre, email FROM usuarios WHERE id = ?", [id]);

        const [resultado] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Registrar auditoría
        await registrarAuditoria(req.usuario.id, 'ELIMINAR_USUARIO', 'usuarios', id, { 
            datos_eliminados: usuario[0] 
        });

        res.json({ mensaje: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario. Es posible que tenga pedidos asociados." });
    }
};
