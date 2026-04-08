import db from '../config/db.js';

// Query base simplificada: Buscamos la primera imagen que coincida exactamente
const SELECT_BASE_ACT = `
    SELECT a.*, 
    (SELECT url FROM imagenes WHERE id_objeto = a.id_actividad AND tipo_objeto = 'actividad' LIMIT 1) as foto_principal
    FROM actividades a
`;

export const buscarActividades = async (req, res) => {
    const { ciudad, precioMax, id_categoria, nombre, ordenar } = req.query;
    let query = `${SELECT_BASE_ACT} WHERE a.activo = 1`;
    const params = [];

    if (ciudad) { query += " AND a.ciudad = ?"; params.push(ciudad); }
    if (precioMax) { query += " AND a.precio <= ?"; params.push(Number(precioMax)); }
    if (id_categoria) { query += " AND a.id_categoria = ?"; params.push(id_categoria); }
    if (nombre) { query += " AND a.nombre LIKE ?"; params.push(`%${nombre}%`); }

    if (ordenar === 'barato') query += " ORDER BY a.precio ASC";
    else if (ordenar === 'caro') query += " ORDER BY a.precio DESC";
    else query += " ORDER BY a.fecha_creacion DESC";

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
};

export const getAllActividades = async (req, res) => {
    try {
        const [rows] = await db.query(`${SELECT_BASE_ACT} WHERE a.activo = 1`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};

export const getActividadById = async (req, res) => {
    try {
        const [rows] = await db.query(`${SELECT_BASE_ACT} WHERE a.id_actividad = ?`, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "No encontrada" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalle' });
    }
};