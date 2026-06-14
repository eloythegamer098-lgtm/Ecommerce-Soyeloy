import 'dotenv/config';
import pool from './bd/connection.js';

const setupValoraciones = async () => {
    try {
        console.log('--- Iniciando Setup de Tabla Valoraciones ---');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS valoraciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                producto_id INT NOT NULL,
                estrellas INT NOT NULL CHECK (estrellas >= 1 AND estrellas <= 5),
                comentario TEXT,
                creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                UNIQUE KEY unique_val (usuario_id, producto_id)
            )
        `;

        await pool.query(createTableQuery);
        console.log("Tabla 'valoraciones' verificada/creada con éxito.");
        process.exit(0);
    } catch (error) {
        console.error("ERROR en setup valoraciones:", error);
        process.exit(1);
    }
};

setupValoraciones();
