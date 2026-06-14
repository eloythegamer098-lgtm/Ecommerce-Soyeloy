import 'dotenv/config';
import pool from './bd/connection.js';

const setupFavoritos = async () => {
    try {
        console.log('--- Iniciando Setup de Tabla Favoritos ---');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS favoritos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                producto_id INT NOT NULL,
                creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                UNIQUE KEY unique_fav (usuario_id, producto_id)
            )
        `;

        await pool.query(createTableQuery);
        console.log("Tabla 'favoritos' verificada/creada con éxito.");
        process.exit(0);
    } catch (error) {
        console.error("ERROR en setup favoritos:", error);
        process.exit(1);
    }
};

setupFavoritos();
