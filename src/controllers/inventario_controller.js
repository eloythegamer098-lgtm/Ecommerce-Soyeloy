import pool from "../bd/connection.js";
import { registrarAuditoria } from "../services/auditService.js";

// Obtener historial de stock
export const obtenerHistorialStock = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT h.*, p.nombre as producto_nombre 
            FROM historial_stock h 
            JOIN productos p ON h.producto_id = p.id 
            ORDER BY h.fecha DESC 
            LIMIT 50
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el historial de stock" });
    }
};

// Actualizar stock rápidamente
export const ajustarStock = async (req, res) => {
    const { id } = req.params;
    const { cantidad, tipo, motivo } = req.body;

    if (cantidad === undefined || !tipo) {
        return res.status(400).json({ error: "Cantidad y tipo son obligatorios" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener stock actual
        const [products] = await connection.query("SELECT stock FROM productos WHERE id = ?", [id]);
        if (products.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        let nuevoStock = products[0].stock;
        if (tipo === 'incremento') nuevoStock += parseInt(cantidad);
        else if (tipo === 'decremento') nuevoStock -= parseInt(cantidad);
        else if (tipo === 'ajuste') nuevoStock = parseInt(cantidad);

        if (nuevoStock < 0) {
            await connection.rollback();
            return res.status(400).json({ error: "El stock no puede ser negativo" });
        }

        // 2. Actualizar producto
        await connection.query("UPDATE productos SET stock = ? WHERE id = ?", [nuevoStock, id]);

        // 3. Registrar en historial (Específico de inventario)
        await connection.query(
            "INSERT INTO historial_stock (producto_id, cantidad_cambio, tipo, motivo) VALUES (?, ?, ?, ?)",
            [id, cantidad, tipo, motivo || 'Ajuste manual de inventario']
        );

        // 4. Registrar en Auditoría General
        await registrarAuditoria(req.usuario.id, 'AJUSTAR_STOCK', 'productos', id, { cantidad, tipo, nuevoStock });

        await connection.commit();
        res.json({ mensaje: "Stock actualizado correctamente", nuevoStock });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error interno al ajustar stock" });
    } finally {
        connection.release();
    }
};
