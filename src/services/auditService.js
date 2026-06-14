import pool from '../bd/connection.js';

/**
 * Registra una acción administrativa en la base de datos
 * @param {number} adminId - ID del administrador que realiza la acción
 * @param {string} accion - Descripción corta de la acción (ej: 'CREAR_PRODUCTO')
 * @param {string} tabla - Tabla afectada
 * @param {number} registroId - ID del registro afectado
 * @param {object} detalles - Objeto con detalles adicionales (antes/después)
 */
export const registrarAuditoria = async (adminId, accion, tabla = null, registroId = null, detalles = {}) => {
    try {
        await pool.query(
            "INSERT INTO auditoria_admin (admin_id, accion, tabla_afectada, registro_id, detalles) VALUES (?, ?, ?, ?, ?)",
            [adminId, accion, tabla, registroId, JSON.stringify(detalles)]
        );
    } catch (error) {
        console.error("Error en el sistema de auditoría:", error);
    }
};
