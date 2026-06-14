# Plan de Preparación para Deploy Profesional

## Objetivo
Elevar la solidez del proyecto en producción automatizando la validación de variables de entorno, orquestando la inicialización de la base de datos (evitando ejecuciones manuales de múltiples scripts) y asegurando la resiliencia del entorno (ej. creación automática de carpetas necesarias).

## Archivos Clave
- `src/validate_env.js` (NUEVO)
- `src/init_db.js` (NUEVO)
- `src/server_express.js` (MODIFICAR)
- `package.json` (Raíz) (MODIFICAR)

## Pasos de Implementación

### 1. Validación Estricta de Entorno (`src/validate_env.js`)
Crear un script que verifique la existencia de variables críticas antes de permitir que el servidor arranque. Si faltan variables como `JWT_SECRET` o `DB_HOST`, el script detendrá el proceso con un mensaje claro, evitando errores silenciosos en producción.

### 2. Orquestador de Base de Datos (`src/init_db.js`)
Agrupar y ejecutar en orden los scripts existentes (`setup_fase1.js`, `setup_productos.js`, etc.). Esto permite levantar la base de datos de producción con un solo comando en lugar de ejecutar 10 scripts distintos.

### 3. Resiliencia de Logs (`src/server_express.js` / `src/services/logger.js`)
Asegurar que el directorio `logs/` se cree automáticamente si no existe. Actualmente PM2 o Winston pueden fallar o no registrar errores críticos si la carpeta no está presente en el servidor de destino.

### 4. Actualización de Scripts de Despliegue (`package.json`)
Modificar los scripts del `package.json` raíz para incluir un flujo continuo:
`npm run deploy:setup` -> que ejecute la instalación, validación de entorno y orquestación de DB.

## Verificación
1. Eliminar temporalmente una variable del `.env` y comprobar que el validador la detecta.
2. Ejecutar el orquestador de DB y verificar que las tablas se crean/actualizan correctamente sin duplicar datos.
3. Simular el inicio de producción con PM2 y confirmar la correcta generación del directorio de logs y funcionamiento de la API.