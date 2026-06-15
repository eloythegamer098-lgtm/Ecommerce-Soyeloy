# ==========================================
# Dockerfile para Backend Node.js (Neon Store)
# ==========================================

# 1. Fase de construcción y ejecución
FROM node:22-bookworm-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
# Se usa el wildcard package*.json para copiar tanto package.json como package-lock.json
COPY package*.json ./

# Instalar dependencias de producción de forma segura y optimizada
# npm ci es el comando estándar para entornos de CI/CD (Production)
RUN npm ci --omit=dev || npm install --omit=dev

# Copiar el resto del código fuente del backend (respetando .dockerignore)
COPY . .

# Exponer el puerto configurado en el código (Express usa 3000 por defecto)
EXPOSE 3000

# Variables de entorno por defecto (Railway inyectará las reales)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
