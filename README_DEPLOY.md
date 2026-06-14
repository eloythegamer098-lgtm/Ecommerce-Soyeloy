# Guía de Deploy Profesional - Neon Store

Este proyecto ha sido optimizado para un despliegue profesional. A continuación se detallan los pasos necesarios para ponerlo en producción.

## Requisitos
- Node.js v18+ 
- MySQL 8.0+
- PM2 (opcional, para gestión de procesos)

## Configuración de Entorno
1. Copia el archivo `.env.example` a `.env` en la raíz, en `src/` y en `Fronted/frontend-ecommerce/`.
2. Ajusta las variables según tu servidor de producción (especialmente `DB_*`, `JWT_SECRET` y `ALLOWED_ORIGINS`).

## Pasos para el Despliegue

### 1. Instalación de Dependencias
Desde la raíz del proyecto, ejecuta:
```bash
npm run install:all
```

### 2. Construcción del Frontend
Compila el frontend para producción:
```bash
npm run build:all
```
Esto generará la carpeta `dist` dentro de `Fronted/frontend-ecommerce/`.

### 3. Ejecución del Servidor

#### Opción A: Usando PM2 (Recomendado)
PM2 gestionará el proceso, lo reiniciará si falla y permitirá usar todos los núcleos del CPU.
```bash
pm2 start ecosystem.config.cjs --env production
```

#### Opción B: Ejecución Directa
```bash
npm run prod
```

## Características de Producción Incluidas
- **Compresión Gzip:** Reduce el tamaño de las respuestas.
- **Seguridad Helmet:** Cabeceras HTTP seguras activadas.
- **CORS Restringido:** Solo permite orígenes configurados.
- **Rate Limiting:** Protección contra ataques de fuerza bruta y DoS.
- **Serving Estático:** El backend sirve el frontend automáticamente en producción.
- **Health Check:** Endpoint `/health` disponible para monitoreo.

## Notas Adicionales
- Asegúrate de que el puerto (por defecto 3000) esté abierto en tu firewall.
- Se recomienda usar un proxy inverso como **Nginx** frente al servidor de Node.js para manejar SSL (HTTPS).
