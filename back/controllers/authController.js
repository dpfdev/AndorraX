import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
// Añadimos ?v=1 al final para obligar a Node a leer el archivo de nuevo
import { enviarEmailConfirmacion, enviarEmailRecuperacion } from '../services/emailService.js'; // REGISTRO
export const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0) return res.status(400).json({ error: "El email ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString('hex');
        const exp = new Date(); exp.setHours(exp.getHours() + 24);

        await db.query(
            'INSERT INTO usuarios (nombre, email, password, verificado, token_seguridad, token_expiracion) VALUES (?, ?, ?, 0, ?, ?)',
            [nombre, email, hashedPassword, token, exp]
        );

        await enviarEmailConfirmacion(nombre, email, token);
        res.status(201).json({ message: "Registro exitoso. Revisa tu email." });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// CONFIRMAR CUENTA
export const confirmarCuenta = async (req, res) => {
    const { token } = req.params;
    try {
        const [u] = await db.query('SELECT id_usuario FROM usuarios WHERE token_seguridad = ? AND token_expiracion > NOW()', [token]);
        if (u.length === 0) return res.status(400).json({ error: "Enlace inválido o expirado" });

        await db.query('UPDATE usuarios SET verificado = 1, token_seguridad = NULL, token_expiracion = NULL WHERE id_usuario = ?', [u[0].id_usuario]);
        res.json({ message: "Cuenta verificada con éxito" });
    } catch (e) { res.status(500).json({ error: "Error de servidor" }); }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });
        if (!rows[0].verificado) return res.status(403).json({ error: "Cuenta no verificada" });

        const passOk = await bcrypt.compare(password, rows[0].password);
        if (!passOk) return res.status(401).json({ error: "Password incorrecto" });

        const token = jwt.sign({ id: rows[0].id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { nombre: rows[0].nombre } });
    } catch (e) { res.status(500).json({ error: "Error en login" }); }
};

// SOLICITAR RECUPERACIÓN
export const solicitarRecuperacion = async (req, res) => {
    const { email } = req.body;
    try {
        const [u] = await db.query('SELECT nombre FROM usuarios WHERE email = ?', [email]);
        if (u.length === 0) return res.status(404).json({ error: "Email no registrado" });

        const token = crypto.randomBytes(32).toString('hex');
        const exp = new Date(); exp.setHours(exp.getHours() + 1);

        await db.query('UPDATE usuarios SET token_seguridad = ?, token_expiracion = ? WHERE email = ?', [token, exp, email]);
        await enviarEmailRecuperacion(u[0].nombre, email, token);
        res.json({ message: "Email de recuperación enviado" });
    } catch (e) { res.status(500).json({ error: "Error" }); }
};

// RESTABLECER PASSWORD
export const restablecerPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const [u] = await db.query('SELECT id_usuario FROM usuarios WHERE token_seguridad = ? AND token_expiracion > NOW()', [token]);
        if (u.length === 0) return res.status(400).json({ error: "Token inválido" });

        const hashed = await bcrypt.hash(password, 10);
        await db.query('UPDATE usuarios SET password = ?, token_seguridad = NULL, token_expiracion = NULL WHERE id_usuario = ?', [hashed, u[0].id_usuario]);
        res.json({ message: "Contraseña actualizada" });
    } catch (e) { res.status(500).json({ error: "Error" }); }
};