import db from '../config/db.js';

export const añadirFavorito = async (req, res) => {
    const { tipo_objeto, id_objeto } = req.body;
    const id_usuario = req.usuario.id;

    if (!tipo_objeto || !id_objeto) {
        return res.status(400).json({ error: "Faltan tipo_objeto o id_objeto" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [existe] = await connection.query(
            'SELECT id_favorito FROM favoritos WHERE id_usuario = ? AND tipo_objeto = ? AND id_objeto = ?',
            [id_usuario, tipo_objeto, id_objeto]
        );

        if (existe.length > 0) {
            return res.status(400).json({ error: "Este elemento ya está en tus favoritos" });
        }

        const [resultPrincipal] = await connection.query(
            'INSERT INTO favoritos (id_usuario, tipo_objeto, id_objeto, fecha_agregado) VALUES (?, ?, ?, NOW())',
            [id_usuario, tipo_objeto, id_objeto]
        );

        const id_favorito = resultPrincipal.insertId;
        let queryHija = tipo_objeto === 'hotel' ? 'INSERT INTO favoritos_hoteles (id_favorito, id_hotel) VALUES (?, ?)' :
                         tipo_objeto === 'actividad' ? 'INSERT INTO favoritos_actividades (id_favorito, id_actividad) VALUES (?, ?)' :
                         'INSERT INTO favoritos_eventos (id_favorito, id_evento) VALUES (?, ?)';

        await connection.query(queryHija, [id_favorito, id_objeto]);
        await connection.commit();
        res.status(201).json({ message: "Añadido a favoritos", id_favorito });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al añadir a favoritos", detalle: error.message });
    } finally {
        connection.release();
    }
};

export const getMisFavoritos = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const query = `
            SELECT f.id_favorito, f.tipo_objeto, f.fecha_agregado,
                   h.nombre AS nombre_hotel, e.nombre AS nombre_evento, a.nombre AS nombre_actividad
            FROM favoritos f
            LEFT JOIN favoritos_hoteles fh ON f.id_favorito = fh.id_favorito
            LEFT JOIN hoteles h ON fh.id_hotel = h.id_hotel
            LEFT JOIN favoritos_eventos fe ON f.id_favorito = fe.id_favorito
            LEFT JOIN eventos e ON fe.id_evento = e.id_evento
            LEFT JOIN favoritos_actividades fa ON f.id_favorito = fa.id_favorito
            LEFT JOIN actividades a ON fa.id_actividad = a.id_actividad
            WHERE f.id_usuario = ? ORDER BY f.fecha_agregado DESC`;

        const [rows] = await db.query(query, [id_usuario]);
        res.json(rows.map(fav => ({
            id: fav.id_favorito,
            tipo: fav.tipo_objeto,
            fecha: fav.fecha_agregado,
            nombre: fav.nombre_hotel || fav.nombre_evento || fav.nombre_actividad
        })));
    } catch (error) {
        res.status(500).json({ error: "Error al obtener favoritos" });
    }
};

export const eliminarFavorito = async (req, res) => {
    const id_favorito = req.params.id;
    const id_usuario = req.usuario.id;
    try {
        const [check] = await db.query('SELECT id_usuario FROM favoritos WHERE id_favorito = ?', [id_favorito]);
        if (check.length === 0) return res.status(404).json({ error: "No encontrado" });
        if (check[0].id_usuario !== id_usuario) return res.status(403).json({ error: "No autorizado" });

        await db.query('DELETE FROM favoritos WHERE id_favorito = ?', [id_favorito]);
        res.json({ message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};