import 'dotenv/config';
import pool from './bd/connection.js';
import bcrypt from 'bcryptjs';

const setupAdmin = async () => {
    try {
        console.log('--- Iniciando Verificación de Base de Datos ---');

        // 1. Verificar si existe la columna 'rol'
        const [columns] = await pool.query("SHOW COLUMNS FROM usuarios LIKE 'rol'");
        
        if (columns.length === 0) {
            console.log("Agregando columna 'rol' a la tabla usuarios...");
            await pool.query("ALTER TABLE usuarios ADD COLUMN rol ENUM('user', 'admin') DEFAULT 'user'");
            console.log("Columna 'rol' agregada con éxito.");
        } else {
            console.log("La columna 'rol' ya existe.");
        }

        // 2. Crear usuario administrador
        const adminEmail = 'admin@soyeloy.com';
        const adminPassword = 'Admin12345';
        const adminNombre = 'Administrador';
        const adminRol = 'admin';

        const [existingAdmin] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [adminEmail]);

        if (existingAdmin.length === 0) {
            console.log(`Creando usuario administrador: ${adminEmail}...`);
            const hashPassword = await bcrypt.hash(adminPassword, 12);
            
            await pool.query(
                "INSERT INTO usuarios(nombre, email, password, rol) VALUES (?, ?, ?, ?)",
                [adminNombre, adminEmail, hashPassword, adminRol]
            );
            console.log("Usuario administrador creado con éxito.");
        } else {
            console.log("El usuario administrador ya existe. Actualizando su rol a 'admin' por seguridad...");
            await pool.query("UPDATE usuarios SET rol = 'admin' WHERE email = ?", [adminEmail]);
        }

        console.log('--- Proceso Finalizado con Éxito ---');
        process.exit(0);
    } catch (error) {
        console.error("ERROR CRÍTICO durante el setup:", error);
        process.exit(1);
    }
};

setupAdmin();
