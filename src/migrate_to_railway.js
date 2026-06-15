import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 1. Cargar variables de entorno explícitamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("📝 Archivo .env cargado desde:", envPath);
} else {
    console.error("❌ ERROR: No se encontró el archivo .env en la carpeta src");
    process.exit(1);
}

/**
 * SCRIPT DE MIGRACIÓN FORZADA
 */
const scripts = [
    'setup_fase1.js',
    'setup_productos.js',
    'setup_fase2.js',
    'setup_fase3.js',
    'setup_inventario.js',
    'setup_favoritos.js',
    'setup_valoraciones.js',
    'setup_config.js',
    'setup_recovery.js',
    'setup_admin.js'
];

async function migrar() {
    console.log("🚀 Probando conexión con:", process.env.DB_HOST);
    
    if (process.env.DB_HOST === 'localhost') {
        console.warn("⚠️ ADVERTENCIA: Estás apuntando a 'localhost'. ¿Seguro que configuraste Railway en el .env?");
    }

    for (const script of scripts) {
        try {
            console.log(`\n📦 Ejecutando: ${script}...`);
            // Ejecutamos pasándole las variables de entorno actuales
            execSync(`node ${path.join(__dirname, script)}`, { 
                stdio: 'inherit',
                env: process.env 
            });
            console.log(`✅ ${script} completado.`);
        } catch (error) {
            console.error(`❌ Error en ${script}. El proceso continuará con el siguiente.`);
        }
    }

    console.log("\n✨ MIGRACIÓN FINALIZADA.");
}

migrar();
