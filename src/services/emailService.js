import nodemailer from 'nodemailer';
import 'dotenv/config';

// Configuración de transporte
// Se recomienda usar variables de entorno para SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS,
    },
});

export const enviarEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Neon Store 🚀" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Mensaje enviado: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error enviando email:", error);
        throw error;
    }
};

// Templates predefinidos con estética Cyberpunk
export const templates = {
    recuperacion: (nombre, link) => `
        <div style="background-color: #0d0d0d; color: #fff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #bc13fe; border-radius: 10px; max-width: 600px; margin: auto;">
            <h1 style="color: #bc13fe; text-align: center; text-transform: uppercase; letter-spacing: 5px; text-shadow: 0 0 10px #bc13fe;">Neon Store</h1>
            <h2 style="color: #00f2ff; text-align: center;">Recuperación de Acceso</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña en el sistema.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${link}" style="background: transparent; color: #00f2ff; border: 2px solid #00f2ff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase; box-shadow: 0 0 15px #00f2ff;">Restablecer Contraseña</a>
            </div>
            <p style="font-size: 0.8rem; color: #666;">Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">
            <p style="text-align: center; color: #bc13fe;">&copy; 2026 Neon Store - Built for Gamers</p>
        </div>
    `,
    bienvenida: (nombre) => `
        <div style="background-color: #0d0d0d; color: #fff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #00f2ff; border-radius: 10px; max-width: 600px; margin: auto;">
            <h1 style="color: #bc13fe; text-align: center; text-transform: uppercase; letter-spacing: 5px;">Neon Store</h1>
            <h2 style="color: #22c55e; text-align: center;">¡Bienvenido al Futuro, ${nombre}!</h2>
            <p>Tu cuenta ha sido activada con éxito en nuestra plataforma.</p>
            <p>Ya puedes acceder a los mejores productos con estética gamer y cyberpunk.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.FRONTEND_URL}/Login" style="background: #22c55e; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">Iniciar Sesión</a>
            </div>
            <p style="text-align: center; color: #00f2ff;">Prepárate para la experiencia definitiva.</p>
        </div>
    `
};
