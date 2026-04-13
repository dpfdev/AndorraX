import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// --- REGISTRO ---
export const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;
    
    try {
        // 1. Verificar si el usuario ya existe para evitar errores de duplicado
        const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // 2. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insertar (Asegúrate que tu tabla tenga la columna 'rol')
        const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "user")';
        await db.query(query, [nombre, email, hashedPassword]);

        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error interno al registrar usuario" });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = rows[0];

        // Verificación de seguridad para bcrypt
        if (!user.password || !password) {
            return res.status(500).json({ error: "Error en la estructura de datos de la DB" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            user: { nombre: user.nombre, rol: user.rol } 
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};