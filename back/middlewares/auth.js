import jwt from 'jsonwebtoken';

// 1. Verifica que el token sea válido (EL BASE)
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado, token no proporcionado" });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(403).json({ error: "Token no válido o expirado" });
    }
};

// 2. Verifica que sea un usuario válido (Alias de verificarToken)
export const verificarUsuario = (req, res, next) => {
    verificarToken(req, res, next);
};

// 3. Verifica que el usuario tenga rol de ADMIN
export const verificarAdmin = (req, res, next) => {
    verificarToken(req, res, () => {
        if (req.usuario && req.usuario.rol === 'admin') {
            next();
        } else {
            res.status(403).json({ error: "Acceso restringido: se requieren permisos de administrador" });
        }
    });
};