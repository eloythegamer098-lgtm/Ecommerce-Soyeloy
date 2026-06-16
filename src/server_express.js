import 'dotenv/config';
import { validateEnv } from './validate_env.js';

// Validar entorno antes de arrancar
validateEnv();

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import { loggerDetallado } from './middlewares/avanzado.js';

import authRoutes from './routes/auth.js';
import productoRoutes from './routes/producto.js';
import categoriasRoutes from './routes/categoria.js';
import pedidosRoutes from './routes/pedidos.js';
import usuariosRoutes from './routes/usuarios.js';
import dashboardRoutes from './routes/dashboard.js';
import botRoutes from './routes/bot.js';
import inventarioRoutes from './routes/inventario.js';
import favoritosRoutes from './routes/favoritos.js';
import valoracionesRoutes from './routes/valoraciones.js';
import cuponesRoutes from './routes/cupones.js';
import auditoriaRoutes from './routes/auditoria.js';
import configuracionRoutes from './routes/configuracion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para proxy en producción
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// 1. LOGGING (PRIMERO PARA VER TODAS LAS PETICIONES)
app.use(loggerDetallado);

// 2. CONFIGURACIÓN DE CORS PROFESIONAL
const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://ecommerce-soyeloy-production.up.railway.app'
];

// Limpieza profunda de variables de entorno (quita comillas, espacios y barras finales)
const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
        .map(o => o.trim().replace(/['"]/g, '').replace(/\/$/, ""))
        .filter(Boolean)
    : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir sin origen (Postman, etc)
        if (!origin) return callback(null, true);
        
        const cleanOrigin = origin.trim().replace(/\/$/, "");
        if (allowedOrigins.some(o => o.replace(/\/$/, "") === cleanOrigin)) {
            return callback(null, true);
        }

        console.error(`❌ CORS BLOQUEADO: ${origin}`);
        console.error(`✅ PERMITIDOS:`, allowedOrigins);
        return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept', 
        'Origin',
        'Cache-Control',
        'Pragma'
    ],
    optionsSuccessStatus: 204
};

// Manejar Preflight OPTIONS de forma global y explícita
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

console.log('🚀 CORS configurado con éxito:', allowedOrigins);

// 3. SEGURIDAD Y COMPRESIÓN
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: 'no-referrer' }
}));
app.use(compression());

// 4. HEALTH CHECK CON DEBUG DE CORS
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: 'CORS_FIX_V3_FINAL',
        allowedOrigins,
        env_raw: process.env.ALLOWED_ORIGINS || 'NOT_SET',
        timestamp: new Date()
    });
});

// 3. Parsers
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 4. Rate Limit Global
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Límite de tráfico excedido para esta IP." }
});

app.use("/api/", globalLimiter);

// 5. Rate Limit para rutas sensibles
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiados intentos detectados. Por seguridad, su IP ha sido restringida temporalmente."
    }
});

app.use("/api/v1/auth/login", strictLimiter);
app.use("/api/v1/auth/forgot-password", strictLimiter);
app.use("/api/v1/auth/registro", strictLimiter);

// 7. Registro de rutas API v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/productos", productoRoutes);
app.use("/api/v1/categorias", categoriasRoutes);
app.use("/api/v1/pedidos", pedidosRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/bot", botRoutes);
app.use("/api/v1/inventario", inventarioRoutes);
app.use("/api/v1/favoritos", favoritosRoutes);
app.use("/api/v1/valoraciones", valoracionesRoutes);
app.use("/api/v1/cupones", cuponesRoutes);
app.use("/api/v1/auditoria", auditoriaRoutes);
app.use("/api/v1/configuracion", configuracionRoutes);

// 8. Integración del frontend
const frontendPath = path.join(__dirname, '../Fronted/frontend-ecommerce/dist');

app.use(express.static(frontendPath));

// Soporte para Single Page Application en Express 5
app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }

    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 9. Manejo de 404
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        path: req.originalUrl
    });
});

// 10. Manejo global de errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.error("========== ERROR GLOBAL ==========");
    console.error("Ruta:", req.originalUrl);
    console.error("Método:", req.method);
    console.error("Mensaje:", err.message);
    console.error("Código:", err.code);
    console.error("SQL:", err.sql);
    console.error("Stack:", err.stack);
    console.error("==================================");

    res.status(statusCode).json({
        error: "Error interno del servidor",
        detalle: err.message,
        codigo: err.code || null,
        requestId: req.requestId || null
    });
});

// 11. Inicio del servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[SERVER] Port: ${PORT}`);
    console.log(`[SERVER] URL local: http://localhost:${PORT}`);
});

// Capturar errores fatales
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ ERROR FATAL - Rechazo no manejado:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ ERROR FATAL - Excepción no capturada:', err);
    process.exit(1);
});