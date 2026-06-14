import 'dotenv/config';
import pool from './bd/connection.js';

const setupInventario = async () => {
    try {
        console.log('--- Iniciando Setup de Tabla Historial de Inventario ---');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS historial_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                cantidad_cambio INT NOT NULL,
                tipo ENUM('incremento', 'decremento', 'ajuste') NOT NULL,
                motivo VARCHAR(255),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
        `;

        await pool.query(createTableQuery);
        console.log("Tabla 'historial_stock' verificada/creada con éxito.");

        console.log('--- Proceso de Inventario Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR CRÍTICO durante el setup de inventario:", error);
        process.exit(1);
    }
};

setupInventario();
