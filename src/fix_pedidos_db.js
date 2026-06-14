import 'dotenv/config';
import pool from './bd/connection.js';

const fixPedidosDB = async () => {
    try {
        console.log('--- Iniciando Reparación de Tabla Pedidos ---');

        // 1. Verificar si existe la columna 'creado_en'
        const [creadoCol] = await pool.query("SHOW COLUMNS FROM pedidos LIKE 'creado_en'");
        if (creadoCol.length === 0) {
            console.log("Agregando columna 'creado_en' a la tabla pedidos...");
            // Usamos TIMESTAMP DEFAULT CURRENT_TIMESTAMP para que los registros nuevos tengan fecha automática
            await pool.query("ALTER TABLE pedidos ADD COLUMN creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            console.log("Columna 'creado_en' agregada con éxito.");
        } else {
            console.log("La columna 'creado_en' ya existe.");
        }

        console.log('--- Proceso de Reparación Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR CRÍTICO durante la reparación de pedidos:", error);
        process.exit(1);
    }
};

fixPedidosDB();
