import db from '../config/db.js';

export const publicarResena = async (req, res) => {
    const { tipo_objeto, id_objeto, puntuacion, comentario } = req.body;
    const id_usuario = req.usuario.id;

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ error: "La puntuación debe estar entre 1 y 5" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query(
            'INSERT INTO resenas (id_usuario, tipo_objeto, id_objeto, puntuacion, comentario, fecha_creacion) VALUES (?, ?, ?, ?, ?, NOW())',
            [id_usuario, tipo_objeto, id_objeto, puntuacion, comentario]
        );

        const id_resena = result.insertId;
        let queryHija = tipo_objeto === 'hotel' ? 'INSERT INTO resenas_hoteles (id_resena, id_hotel) VALUES (?, ?)' :
                         tipo_objeto === 'actividad' ? 'INSERT INTO resenas_actividades (id_resena, id_actividad) VALUES (?, ?)' :
                         'INSERT INTO resenas_eventos (id_resena, id_evento) VALUES (?, ?)';

        await connection.query(queryHija, [id_resena, id_objeto]);
        await connection.commit();
        res.status(201).json({ message: "Reseña publicada", id_resena });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al publicar", detalle: error.message });
    } finally {
        connection.release();
    }
};

export const getResenasPorObjeto = async (req, res) => {
    const { tipo, id } = req.params;
    try {
        const query = `
            SELECT r.*, u.nombre AS autor FROM resenas r
            JOIN usuarios u ON r.id_usuario = u.id_usuario
            WHERE r.tipo_objeto = ? AND r.id_objeto = ? ORDER BY r.fecha_creacion DESC`;
        const [rows] = await db.query(query, [tipo, id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener reseñas" });
    }
};

export const eliminarResena = async (req, res) => {
    const id_resena = req.params.id;
    const id_usuario = req.usuario.id;
    const rol = req.usuario.rol;
    try {
        const [check] = await db.query('SELECT id_usuario FROM resenas WHERE id_resena = ?', [id_resena]);
        if (check.length === 0) return res.status(404).json({ error: "No encontrada" });
        if (rol !== 'admin' && check[0].id_usuario !== id_usuario) return res.status(403).json({ error: "No autorizado" });

        await db.query('DELETE FROM resenas WHERE id_resena = ?', [id_resena]);
        res.json({ message: "Reseña eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};