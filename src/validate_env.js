import 'dotenv/config';

const REQUIRED_VARS = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET'
];

export const validateEnv = () => {
    const missing = REQUIRED_VARS.filter(v => !process.env[v]);

    if (missing.length > 0) {
        console.error('❌ ERROR: Faltan variables de entorno críticas en el archivo .env:');
        missing.forEach(v => console.error(`   - ${v}`));
        console.error('\nEl servidor no puede arrancar sin estas configuraciones.');
        process.exit(1);
    }

    console.log('✅ Validación de entorno completada con éxito.');
};

// Si se ejecuta directamente
if (import.meta.url.endsWith('validate_env.js')) {
    validateEnv();
}
