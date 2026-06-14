import 'dotenv/config';
import pool from "./bd/connection.js";

const setupConfig = async () => {
    try {
        console.log("Iniciando configuración de la tabla de ajustes...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS ajustes_tienda (
                clave VARCHAR(50) PRIMARY KEY,
                valor TEXT,
                categoria VARCHAR(30) DEFAULT 'general',
                descripcion TEXT,
                actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Insertar valores por defecto si no existen
        const defaults = [
            ['nombre_tienda', 'NEON STORE', 'general', 'Nombre oficial de la tienda'],
            ['email_contacto', 'soporte@neonstore.com', 'contacto', 'Email para atención al cliente'],
            ['telefono_contacto', '+51 999 888 777', 'contacto', 'Teléfono de soporte'],
            ['direccion_tienda', 'Av. Cyberpunk 2077, Night City', 'contacto', 'Dirección física o fiscal'],
            ['moneda_simbolo', '$', 'apariencia', 'Símbolo de la moneda'],
            ['modo_mantenimiento', '0', 'sistema', '1 para activar modo mantenimiento, 0 para desactivar'],
            ['chatbot_activo', '1', 'sistema', 'Activar o desactivar el asistente IA'],
            ['social_facebook', 'https://facebook.com/neonstore', 'social', 'Enlace a Facebook'],
            ['social_instagram', 'https://instagram.com/neonstore', 'social', 'Enlace a Instagram'],
            ['envio_gratis_minimo', '50', 'ventas', 'Monto mínimo para envío gratis']
        ];

        for (const [clave, valor, categoria, descripcion] of defaults) {
            await pool.query(
                "INSERT IGNORE INTO ajustes_tienda (clave, valor, categoria, descripcion) VALUES (?, ?, ?, ?)",
                [clave, valor, categoria, descripcion]
            );
        }

        console.log("Tabla 'ajustes_tienda' lista con valores iniciales.");
        process.exit(0);
    } catch (error) {
        console.error("Error en setup_config:", error);
        process.exit(1);
    }
};

setupConfig();
