import 'dotenv/config'
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { loggerDetallado } from './middlewares/avanzado.js';
import authRoutes from './routes/auth.js';
import productoRoutes from './routes/producto.js';
import categoriasRoutes from './routes/categoria.js'
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

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Logging y CORS (Máxima prioridad para diagnóstico)
app.use(loggerDetallado);
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. Seguridad con Helmet
app.use(helmet({
    contentSecurityPolicy: false, 
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: false, // Desactivar XSS Filter de Helmet
    noSniff: true,
    hidePoweredBy: true
}));

// 3. Parsers y Limpieza de Datos
app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());
// app.use(hpp()); // COMENTADO: Posible causa de error en Express 5

// 4. Configuración de Rate Limit Global (Capa base de protección)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // Máximo 500 peticiones por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Límite de tráfico excedido para esta IP." }
});
app.use("/api/", globalLimiter);

// 5. Rate Limit Específico para rutas sensibles (Hardening)
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20, // Solo 20 intentos por hora
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Demasiados intentos detectados. Por seguridad, su IP ha sido restringida temporalmente." }
});
app.use("/api/v1/auth/login", strictLimiter);
app.use("/api/v1/auth/forgot-password", strictLimiter);
app.use("/api/v1/auth/registro", strictLimiter);

// Registro de Rutas API v1
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

// Manejo de errores global (Production-ready)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? "Ha ocurrido un error interno en el servidor" 
        : err.message;
    
    logger.error(`[${req.requestId || 'N/A'}] ${err.stack}`);
    
    res.status(statusCode).json({ 
        error: message,
        requestId: req.requestId 
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo con express </h1>');
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
.requestId 
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo con express </h1>');
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
