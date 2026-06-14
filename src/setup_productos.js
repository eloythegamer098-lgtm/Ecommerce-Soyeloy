import 'dotenv/config';
import pool from './bd/connection.js';

const setupProductos = async () => {
    try {
        console.log('--- Iniciando Verificación de Tabla Productos ---');

        // 1. Verificar si existe la columna 'imagen'
        const [imgCol] = await pool.query("SHOW COLUMNS FROM productos LIKE 'imagen'");
        if (imgCol.length === 0) {
            console.log("Agregando columna 'imagen' a la tabla productos...");
            await pool.query("ALTER TABLE productos ADD COLUMN imagen VARCHAR(255) DEFAULT 'https://via.placeholder.com/300x400?text=No+Image'");
            console.log("Columna 'imagen' agregada con éxito.");
        }

        // 2. Verificar si existe la columna 'activo'
        const [actCol] = await pool.query("SHOW COLUMNS FROM productos LIKE 'activo'");
        if (actCol.length === 0) {
            console.log("Agregando columna 'activo' a la tabla productos...");
            await pool.query("ALTER TABLE productos ADD COLUMN activo TINYINT(1) DEFAULT 1");
            console.log("Columna 'activo' agregada con éxito.");
        }

        console.log('--- Proceso de Productos Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR CRÍTICO durante el setup de productos:", error);
        process.exit(1);
    }
};

setupProductos();
