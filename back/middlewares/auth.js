import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No autorizado: Token faltante" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secreto = process.env.JWT_SECRET || 'unaSecretKey12345';
        const decoded = jwt.verify(token, secreto);
        
        const userId = decoded.id_usuario || decoded.id;

        if (!userId) {
            return res.status(401).json({ error: "Token inválido: No se encontró ID de usuario" });
        }

        // Usamos 'user' para que coincida con el controlador
        req.user = { 
            id: userId, 
            rol: decoded.rol 
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: "Sesión inválida o expirada" });
    }
};

export const verificarUsuario = verificarToken;

export const verificarAdmin = (req, res, next) => {
    verificarToken(req, res, () => {
        if (req.user && req.user.rol === 'admin') {
            next();
        } else {
            res.status(403).json({ error: "Acceso denegado: Se requiere rol de administrador" });
        }
    });
};