import 'dotenv/config';
import pool from './bd/connection.js';

const verifyFavs = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT f.id, u.nombre as usuario, p.nombre as producto, f.creado_at 
            FROM favoritos f
            JOIN usuarios u ON f.usuario_id = u.id
            JOIN productos p ON f.producto_id = p.id
            ORDER BY f.creado_at DESC LIMIT 5
        `);
        
        if (rows.length === 0) {
            console.log("SISTEMA: La tabla 'favoritos' está vacía. Por favor, añade uno desde el frontend.");
        } else {
            console.log("--- ÚLTIMOS FAVORITOS REGISTRADOS ---");
            console.table(rows);
        }
        process.exit(0);
    } catch (error) {
        console.error("ERROR AL VERIFICAR:", error.message);
        process.exit(1);
    }
};

verifyFavs();
