import 'dotenv/config';
import pool from './bd/connection.js';

const setupFase1 = async () => {
    try {
        console.log('--- Iniciando Setup Fase 1 (Seguridad) ---');

        const tableResets = `
            CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                expira_at DATETIME NOT NULL,
                utilizado TINYINT(1) DEFAULT 0,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `;

        const tableAuditoria = `
            CREATE TABLE IF NOT EXISTS auditoria_admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NOT NULL,
                accion VARCHAR(255) NOT NULL,
                tabla_afectada VARCHAR(50),
                registro_id INT,
                detalles JSON,
                creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES usuarios(id)
            )
        `;

        await pool.query(tableResets);
        console.log("Tabla 'password_resets' verificada/creada.");

        await pool.query(tableAuditoria);
        console.log("Tabla 'auditoria_admin' verificada/creada.");

        console.log('--- Setup Fase 1 Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR en setup fase 1:", error);
        process.exit(1);
    }
};

setupFase1();
