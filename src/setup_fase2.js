import 'dotenv/config';
import pool from './bd/connection.js';

const setupFase2 = async () => {
    try {
        console.log('--- Iniciando Setup Fase 2 (Marketing) ---');

        // 1. Agregar precio_oferta a productos
        const [prodCols] = await pool.query("SHOW COLUMNS FROM productos LIKE 'precio_oferta'");
        if (prodCols.length === 0) {
            await pool.query("ALTER TABLE productos ADD COLUMN precio_oferta DECIMAL(10, 2) DEFAULT NULL");
            console.log("Columna 'precio_oferta' añadida a productos.");
        }

        // 2. Tabla de Cupones
        const tableCupones = `
            CREATE TABLE IF NOT EXISTS cupones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                codigo VARCHAR(50) UNIQUE NOT NULL,
                tipo ENUM('porcentaje', 'fijo') NOT NULL,
                valor DECIMAL(10, 2) NOT NULL,
                expira_at DATETIME NOT NULL,
                limite_uso INT DEFAULT 100,
                usos_actuales INT DEFAULT 0,
                activo TINYINT(1) DEFAULT 1,
                creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(tableCupones);
        console.log("Tabla 'cupones' verificada/creada.");

        // 3. Modificar pedidos para soportar cupones
        const [pedidoCuponCol] = await pool.query("SHOW COLUMNS FROM pedidos LIKE 'cupon_id'");
        if (pedidoCuponCol.length === 0) {
            await pool.query("ALTER TABLE pedidos ADD COLUMN cupon_id INT NULL, ADD COLUMN descuento DECIMAL(10, 2) DEFAULT 0");
            await pool.query("ALTER TABLE pedidos ADD FOREIGN KEY (cupon_id) REFERENCES cupones(id)");
            console.log("Columnas de cupones añadidas a pedidos.");
        }

        console.log('--- Setup Fase 2 Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR en setup fase 2:", error);
        process.exit(1);
    }
};

setupFase2();
