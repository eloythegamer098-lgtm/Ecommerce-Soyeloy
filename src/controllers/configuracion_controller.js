import pool from "../bd/connection.js";
import { registrarAuditoria } from "../services/auditService.js";

// Obtener todos los ajustes
export const obtenerAjustes = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM ajustes_tienda ORDER BY categoria");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los ajustes de la tienda" });
    }
};

// Actualizar múltiples ajustes
export const actualizarAjustes = async (req, res) => {
    const { ajustes } = req.body; // Array de { clave, valor }

    if (!Array.isArray(ajustes)) {
        return res.status(400).json({ error: "El formato de los ajustes es inválido" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const ajuste of ajustes) {
            const { clave, valor } = ajuste;
            await connection.query(
                "UPDATE ajustes_tienda SET valor = ? WHERE clave = ?",
                [valor, clave]
            );
        }

        // Auditoría
        await registrarAuditoria(req.usuario.id, 'ACTUALIZAR_CONFIGURACION_TIENDA', 'ajustes_tienda', null, { 
            cantidad_cambios: ajustes.length 
        });

        await connection.commit();
        res.json({ mensaje: "Configuración actualizada correctamente" });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la configuración" });
    } finally {
        connection.release();
    }
};

// Obtener un ajuste específico (Útil para el frontend público)
export const obtenerAjustePorClave = async (req, res) => {
    const { clave } = req.params;
    try {
        const [rows] = await pool.query("SELECT valor FROM ajustes_tienda WHERE clave = ?", [clave]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Ajuste no encontrado" });
        }
        res.json({ clave, valor: rows[0].valor });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el ajuste" });
    }
};
