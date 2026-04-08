import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// --- REGISTRO ---
export const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "user")';
        await db.query(query, [nombre, email, hashedPassword]);
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Usamos SELECT * para traer absolutamente TODO y ver qué hay dentro
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const user = rows[0];

        // --- DEPURACIÓN CRÍTICA ---
        console.log("------------------------------------------");
        console.log("DATOS RECUPERADOS DE LA DB:", user);
        console.log("¿EXISTE user.password?:", user.password ? "SÍ" : "NO");
        console.log("¿QUÉ LLEGA EN password DEL FRONTEND?:", password ? "SÍ" : "NO");
        console.log("------------------------------------------");

        // Verificamos manualmente antes de llamar a bcrypt para evitar el crash
        if (!user.password || !password) {
            return res.status(500).json({ 
                error: "Faltan argumentos para la comparación",
                debug: { db_pass: !!user.password, front_pass: !!password }
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
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
        console.error("Error detallado en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};