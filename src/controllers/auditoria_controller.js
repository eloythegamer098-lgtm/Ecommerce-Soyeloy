import pool from "../bd/connection.js";

// Listar logs de auditoría (Solo Admin)
export const listarAuditoria = async (req, res) => {
    try {
        const { limit = 200, offset = 0 } = req.query;
        const [rows] = await pool.query(`
            SELECT a.*, u.nombre as admin_nombre, u.email as admin_email 
            FROM auditoria_admin a
            JOIN usuarios u ON a.admin_id = u.id
            ORDER BY a.creado_at DESC
            LIMIT ? OFFSET ?
        `, [parseInt(limit), parseInt(offset)]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener logs de auditoría" });
    }
};

// Obtener detalles de un log específico
export const obtenerLogDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT a.*, u.nombre as admin_nombre 
            FROM auditoria_admin a
            JOIN usuarios u ON a.admin_id = u.id
            WHERE a.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Log no encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalle del log" });
    }
};
