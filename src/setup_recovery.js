import 'dotenv/config';
import pool from './bd/connection.js';

const setupRecovery = async () => {
    try {
        console.log('--- Iniciando Setup de Recuperación de Contraseña ---');

        // 1. Agregar columnas a la tabla usuarios
        const [cols] = await pool.query("SHOW COLUMNS FROM usuarios LIKE 'reset_token'");
        
        if (cols.length === 0) {
            console.log("Agregando columnas de recuperación a la tabla usuarios...");
            await pool.query(`
                ALTER TABLE usuarios 
                ADD COLUMN reset_token VARCHAR(255) NULL, 
                ADD COLUMN reset_expires TIMESTAMP NULL
            `);
            console.log("Columnas agregadas con éxito.");
        } else {
            console.log("Las columnas de recuperación ya existen.");
        }

        console.log('--- Proceso de Base de Datos Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR CRÍTICO durante el setup de recuperación:", error);
        process.exit(1);
    }
};

setupRecovery();
