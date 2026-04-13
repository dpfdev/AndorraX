import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { enviarEmailConfirmacion } from '../services/EmailService.js';

// --- REGISTRO ---
export const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0) return res.status(400).json({ error: "Email ya registrado" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const tokenSeguridad = crypto.randomBytes(32).toString('hex');
        const expiracion = new Date();
        expiracion.setHours(expiracion.getHours() + 24);

        const query = `
            INSERT INTO usuarios 
            (nombre, email, password, rol, verificado, activo, token_seguridad, token_expiracion) 
            VALUES (?, ?, ?, "user", 0, 1, ?, ?)
        `;
        
        await db.query(query, [nombre, email, hashedPassword, tokenSeguridad, expiracion]);
        await enviarEmailConfirmacion(nombre, email, tokenSeguridad);

        res.status(201).json({ message: "Registro exitoso. Revisa tu email." });
    } catch (error) {
        console.error("ERROR_REGISTRO:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// --- CONFIRMAR CUENTA (Aquí estaba el fallo) ---
export const confirmarCuenta = async (req, res) => {
    const { token } = req.params;
    console.log("LOG: Recibido token para confirmar:", token);

    try {
        // 1. Buscar si el token existe y no ha expirado
        const [usuarios] = await db.query(
            'SELECT id_usuario FROM usuarios WHERE token_seguridad = ? AND token_expiracion > NOW()', 
            [token]
        );

        if (usuarios.length === 0) {
            console.log("LOG: Token no encontrado en DB o expirado.");
            return res.status(400).json({ error: "El enlace es inválido o ha caducado." });
        }

        const id = usuarios[0].id_usuario;

        // 2. Actualizar el usuario a verificado
        await db.query(
            'UPDATE usuarios SET verificado = 1, token_seguridad = NULL, token_expiracion = NULL WHERE id_usuario = ?',
            [id]
        );

        console.log(`LOG: Usuario ${id} verificado con éxito.`);
        res.json({ message: "¡Cuenta activada! Ya puedes iniciar sesión." });

    } catch (error) {
        console.error("ERROR_CONFIRMACION:", error);
        res.status(500).json({ error: "Error interno al procesar la activación." });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

        const user = rows[0];

        // Bloquear si no está verificado
        if (user.verificado === 0 || !user.verificado) {
            return res.status(403).json({ error: "Por favor, verifica tu cuenta en tu email primero." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ token, user: { nombre: user.nombre, rol: user.rol } });
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
};