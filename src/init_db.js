import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scripts = [
    'setup_fase1.js',
    'setup_fase2.js',
    'setup_fase3.js',
    'setup_productos.js',
    'setup_inventario.js',
    'setup_favoritos.js',
    'setup_valoraciones.js',
    'setup_config.js',
    'setup_recovery.js',
    'setup_admin.js'
];

const runScript = (scriptName) => {
    return new Promise((resolve, reject) => {
        console.log(`\n🚀 Ejecutando: ${scriptName}...`);
        const child = spawn('node', [scriptName], {
            cwd: __dirname,
            stdio: 'inherit'
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${scriptName} completado.`);
                resolve();
            } else {
                console.error(`❌ ${scriptName} falló con código ${code}`);
                reject(new Error(`Fallo en ${scriptName}`));
            }
        });
    });
};

const initDB = async () => {
    console.log('--- INICIO DE ORQUESTACIÓN DE BASE DE DATOS ---');
    try {
        for (const script of scripts) {
            await runScript(script);
        }
        console.log('\n✨ BASE DE DATOS INICIALIZADA COMPLETAMENTE ✨');
        process.exit(0);
    } catch (error) {
        console.error('\n🛑 Error crítico durante la inicialización:', error.message);
        process.exit(1);
    }
};

initDB();
