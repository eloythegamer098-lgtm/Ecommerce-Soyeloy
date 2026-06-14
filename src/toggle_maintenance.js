import 'dotenv/config';
import pool from "./bd/connection.js";

const toggleMaintenance = async (value) => {
    try {
        await pool.query("UPDATE ajustes_tienda SET valor = ? WHERE clave = 'modo_mantenimiento'", [value]);
        console.log(`MODO MANTENIMIENTO ${value === '1' ? 'ACTIVADO' : 'DESACTIVADO'}`);
        process.exit(0);
    } catch (error) {
        console.error("Error al cambiar modo mantenimiento:", error);
        process.exit(1);
    }
};

const action = process.argv[2] || '1';
toggleMaintenance(action);
