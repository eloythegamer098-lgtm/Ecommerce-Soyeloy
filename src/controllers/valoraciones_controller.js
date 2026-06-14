import pool from "../bd/connection.js";

// Obtener valoraciones de un producto
export const obtenerValoracionesProducto = async (req, res) => {
    const { producto_id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT v.*, u.nombre as usuario_nombre,
            EXISTS(
                SELECT 1 FROM pedidos p 
                JOIN detalle_pedido dp ON p.id = dp.pedido_id 
                WHERE p.usuario_id = v.usuario_id 
                AND dp.producto_id = v.producto_id 
                AND p.estado IN ('pagado', 'enviado', 'entregado')
            ) as compra_verificada
            FROM valoraciones v
            JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.producto_id = ?
            ORDER BY v.creado_at DESC
        `, [producto_id]);

        // Calcular promedio
        const [stats] = await pool.query(`
            SELECT AVG(estrellas) as promedio, COUNT(*) as total 
            FROM valoraciones 
            WHERE producto_id = ?
        `, [producto_id]);

        res.json({
            valoraciones: rows,
            stats: stats[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener valoraciones" });
    }
};

// Crear o actualizar valoración
export const guardarValoracion = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { producto_id, estrellas, comentario } = req.body;

    if (!producto_id || !estrellas) {
        return res.status(400).json({ error: "Producto y estrellas son obligatorios" });
    }

    try {
        // Usar INSERT ... ON DUPLICATE KEY UPDATE para permitir que el usuario actualice su opinión
        await pool.query(`
            INSERT INTO valoraciones (usuario_id, producto_id, estrellas, comentario)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE estrellas = VALUES(estrellas), comentario = VALUES(comentario)
        `, [usuario_id, producto_id, estrellas, comentario]);

        res.json({ mensaje: "Valoración guardada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar la valoración" });
    }
};

// Verificar si el usuario ya valoró
export const miValoracion = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { producto_id } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT * FROM valoraciones WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (error) {
        res.status(500).json({ error: "Error al verificar valoración" });
    }
};
