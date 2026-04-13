import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false 
    }
});

// Esto se ejecutará apenas guardes y el servidor reinicie
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ ERROR EN TRANSPORTER:", error);
    } else {
        console.log("✅ EL SERVIDOR DE CORREO ESTÁ LISTO (GMAIL ACEPTÓ LA CLAVE)");
    }
});

export const enviarEmailConfirmacion = async (nombre, email, token) => {
    try {
        console.log(`--- Iniciando envío de correo a: ${email} ---`);
        
        const urlConfirmacion = `${process.env.FRONTEND_URL}/confirmar/${token}`;
        console.log("URL generada:", urlConfirmacion);

        const mailOptions = {
            from: `"Andorra X Omega" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "❄️ Activa tu Identidad ARC-02",
            html: `
                <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #1e293b;">Bienvenido, ${nombre}</h2>
                    <p>Haz clic en el botón para activar tu cuenta en el sistema:</p>
                    <a href="${urlConfirmacion}" style="background: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                        VERIFICAR MI CUENTA
                    </a>
                    <p style="margin-top: 25px; font-size: 0.8rem; color: #64748b;">Este enlace expira en 24 horas.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 CORREO ENVIADO CON ÉXITO:", info.messageId);
        return info;

    } catch (error) {
        console.error("❌ ERROR DENTRO DE enviarEmailConfirmacion:", error);
        throw error; // Re-lanzamos para que el authController lo capture
    }
};