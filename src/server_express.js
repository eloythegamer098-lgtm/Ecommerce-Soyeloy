import 'dotenv/config';
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

// Configuración para proxy (Heroku, Vercel, Nginx, etc.)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// 1. Logging y CORS
app.use(loggerDetallado);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (como apps móviles o curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. Seguridad con Helmet y Compresión
app.use(helmet({
    contentSecurityPolicy: false, // Ajustar si se sirven assets externos
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true
}));
app.use(compression());

// 3. Parsers
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 4. Rate Limit Global
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // Aumentado para producción
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

// 6. Rutas de salud y base
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.send('<h1>Servidor Express (Neon Store API) funcionando correctamente</h1>');
});

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

// 8. Servir Frontend en Producción
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../Fronted/frontend-ecommerce/dist');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        }
    });
}

// 9. Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        path: req.originalUrl
    });
});

// 10. Manejo global de errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = process.env.NODE_ENV === 'production'
        ? "Ha ocurrido un error interno en el servidor"
        : err.message;

    if (process.env.NODE_ENV !== 'production' || statusCode === 500) {
        console.error("========== ERROR ==========");
        console.error("Request ID:", req.requestId || "N/A");
        console.error("Ruta:", req.originalUrl);
        console.error("Método:", req.method);
        console.error("Error:", err.stack || err.message);
        console.error("===========================");
    }

    res.status(statusCode).json({
        error: message,
        requestId: req.requestId || null
    });
});

// 11. Inicio del servidor
app.listen(PORT, () => {
    console.log(`[SERVER] Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[SERVER] Port: ${PORT}`);
    console.log(`[SERVER] URL: http://localhost:${PORT}`);
});