import pool from "../bd/connection.js";
import { registrarAuditoria } from "../services/auditService.js";

// Validar cupón (Public/User)
export const validarCupon = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT id, codigo, tipo, valor, expira_at, limite_uso, usos_actuales FROM cupones WHERE codigo = ? AND activo = 1 AND expira_at > NOW()",
            [codigo]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Cupón no válido, expirado o inexistente" });
        }

        const cupon = rows[0];
        if (cupon.usos_actuales >= cupon.limite_uso) {
            return res.status(400).json({ error: "Este cupón ha agotado su límite de usos" });
        }

        res.json({ mensaje: "Cupón válido", cupon });
    } catch (error) {
        res.status(500).json({ error: "Error al validar el cupón" });
    }
};

// Listar cupones (Admin)
export const listarCupones = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cupones ORDER BY creado_at DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al listar cupones" });
    }
};

// Crear cupón (Admin)
export const crearCupon = async (req, res) => {
    const { codigo, tipo, valor, expira_at, limite_uso } = req.body;
    try {
        const [resultado] = await pool.query(
            "INSERT INTO cupones (codigo, tipo, valor, expira_at, limite_uso) VALUES (?, ?, ?, ?, ?)",
            [codigo.toUpperCase(), tipo, valor, expira_at, limite_uso || 100]
        );

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'CREAR_CUPON', 'cupones', resultado.insertId, { codigo, tipo, valor });

        res.status(201).json({ mensaje: "Cupón creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el cupón. Es posible que el código ya exista." });
    }
};

// Eliminar/Desactivar cupón (Admin)
export const desactivarCupon = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE cupones SET activo = 0 WHERE id = ?", [id]);

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'DESACTIVAR_CUPON', 'cupones', id);

        res.json({ mensaje: "Cupón desactivado" });
    } catch (error) {
        res.status(500).json({ error: "Error al desactivar el cupón" });
    }
};
