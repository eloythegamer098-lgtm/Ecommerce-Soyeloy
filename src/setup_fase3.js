import 'dotenv/config';
import pool from './bd/connection.js';
import slugify from 'slugify';

const setupFase3 = async () => {
    try {
        console.log('--- Iniciando Setup Fase 3 (SEO) ---');

        // 1. Agregar columna slug a productos
        const [prodCols] = await pool.query("SHOW COLUMNS FROM productos LIKE 'slug'");
        if (prodCols.length === 0) {
            await pool.query("ALTER TABLE productos ADD COLUMN slug VARCHAR(255) UNIQUE AFTER nombre");
            console.log("Columna 'slug' añadida a productos.");

            // Generar slugs para productos existentes
            const [productos] = await pool.query("SELECT id, nombre FROM productos");
            for (const p of productos) {
                const slug = slugify(p.nombre, { lower: true, strict: true });
                // Asegurar que el slug sea único añadiendo ID si es necesario
                await pool.query("UPDATE productos SET slug = ? WHERE id = ?", [`${slug}-${p.id}`, p.id]);
            }
            console.log("Slugs generados para productos existentes.");
        }

        console.log('--- Setup Fase 3 Finalizado ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR en setup fase 3:", error);
        process.exit(1);
    }
};

setupFase3();
