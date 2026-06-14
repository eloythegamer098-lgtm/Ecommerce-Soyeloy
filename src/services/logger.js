import winston from 'winston';
import path from 'path';

// Configuración de niveles y colores
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Formato de los logs
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

// Transportes (Donde se guardan los logs)
const transports = [
    // Consola para desarrollo
    new winston.transports.Console(),
    
    // Archivo para errores críticos
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    
    // Archivo para todos los logs (Rotativo en producción idealmente)
    new winston.transports.File({ filename: 'logs/combined.log' }),
];

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    levels,
    format,
    transports,
});

export default logger;
