import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false }
});

const enviarEmailConfirmacion = async (nombre, email, token) => {
    const url = `${process.env.FRONTEND_URL}/confirmar/${token}`;
    await transporter.sendMail({
        from: `"Andorra X Omega" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "❄️ Activa tu cuenta",
        html: `<p>Hola ${nombre}, confirma aquí: <a href="${url}">${url}</a></p>`
    });
};

const enviarEmailRecuperacion = async (nombre, email, token) => {
    const url = `${process.env.FRONTEND_URL}/restablecer-password/${token}`;
    await transporter.sendMail({
        from: `"Andorra X Omega" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔑 Recuperar Contraseña",
        html: `<p>Hola ${nombre}, restablece aquí: <a href="${url}">${url}</a></p>`
    });
};

// EXPORTACIÓN MANUAL (Para evitar el SyntaxError de Node)
export { enviarEmailConfirmacion, enviarEmailRecuperacion };
