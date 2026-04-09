import db from '../config/db.js';

const SELECT_BASE_EV = `
    SELECT e.*, 
    (SELECT url FROM imagenes WHERE id_objeto = e.id_evento AND tipo_objeto = 'evento' LIMIT 1) as foto_principal
    FROM eventos e
`;

export const buscarEventos = async (req, res) => {
    const { ciudad, precioMax, id_categoria, nombre, fechaDesde, ordenar } = req.query;
    let query = `${SELECT_BASE_EV} WHERE e.activo = 1`;
    const params = [];

    if (ciudad) { query += " AND e.ciudad = ?"; params.push(ciudad); }
    if (id_categoria) { query += " AND e.id_categoria = ?"; params.push(id_categoria); }
    if (precioMax) { query += " AND e.precio <= ?"; params.push(Number(precioMax)); }
    if (nombre) { query += " AND e.nombre LIKE ?"; params.push(`%${nombre}%`); }
    if (fechaDesde) { query += " AND e.fecha_inicio >= ?"; params.push(fechaDesde); }

    if (ordenar === 'barato') query += " ORDER BY e.precio ASC";
    else if (ordenar === 'caro') query += " ORDER BY e.precio DESC";
    else query += " ORDER BY e.fecha_inicio ASC";

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar eventos' });
    }
};

export const getEventos = async (req, res) => {
    try {
        const [rows] = await db.query(`${SELECT_BASE_EV} WHERE e.activo = 1`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
};

export const getEventoById = async (req, res) => {
    try {
        const [rows] = await db.query(`${SELECT_BASE_EV} WHERE e.id_evento = ?`, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Evento no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el evento' });
    }
};