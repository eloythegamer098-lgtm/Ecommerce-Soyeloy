import 'dotenv/config';
import pool from './bd/connection.js';

const checkDB = async () => {
    try {
        const [tables] = await pool.query("SHOW TABLES");
        console.log("Tablas encontradas:", tables.map(t => Object.values(t)[0]));
        
        const tablesToCheck = ['pedidos', 'detalle_pedido', 'usuarios', 'productos', 'categorias', 'historial_stock'];
        for (const table of tablesToCheck) {
            try {
                const [cols] = await pool.query(`SHOW COLUMNS FROM ${table}`);
                console.log(`Columnas en '${table}':`, cols.map(c => c.Field));
            } catch (e) {
                console.log(`La tabla '${table}' NO existe.`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error("Error al conectar:", error);
        process.exit(1);
    }
};

checkDB();