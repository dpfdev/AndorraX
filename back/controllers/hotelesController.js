import db from '../config/db.js';

// Helper para obtener hoteles con su lista de imágenes
// Usamos GROUP_CONCAT para traer todas las URLs en un solo string
const SELECT_BASE = `
    SELECT h.*, 
    GROUP_CONCAT(i.url) as lista_imagenes
    FROM hoteles h
    LEFT JOIN imagenes i ON (i.id_objeto = h.id_hotel AND i.tipo_objeto = 'hotel')
`;

const GROUP_BY = ` GROUP BY h.id_hotel `;

// Función para procesar las filas y convertir el string de imágenes en Array
const procesarImagenes = (rows) => {
    return rows.map(row => ({
        ...row,
        imagenes: row.lista_imagenes ? row.lista_imagenes.split(',') : [],
        foto_principal: row.lista_imagenes ? row.lista_imagenes.split(',')[0] : null
    }));
};

export const buscarHoteles = async (req, res) => {
    const { ciudad, precioMin, precioMax, nombre, estrellas, ordenar } = req.query;
    let query = `${SELECT_BASE} WHERE h.activo = 1`;
    const params = [];

    if (ciudad) { query += " AND h.ciudad = ?"; params.push(ciudad); }
    if (precioMin) { query += " AND h.precio_base_noche >= ?"; params.push(Number(precioMin)); }
    if (precioMax) { query += " AND h.precio_base_noche <= ?"; params.push(Number(precioMax)); }
    if (estrellas) { query += " AND h.categoria_estrellas = ?"; params.push(Number(estrellas)); }
    if (nombre) { query += " AND h.nombre LIKE ?"; params.push(`%${nombre}%`); }

    query += GROUP_BY;

    if (ordenar === 'barato') query += " ORDER BY h.precio_base_noche ASC";
    else if (ordenar === 'caro') query += " ORDER BY h.precio_base_noche DESC";
    else query += " ORDER BY h.fecha_creacion DESC";

    try {
        const [rows] = await db.query(query, params);
        res.json(procesarImagenes(rows));
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
};

export const getAllHoteles = async (req, res) => {
    try {
        const query = `${SELECT_BASE} WHERE h.activo = 1 ${GROUP_BY} ORDER BY h.fecha_creacion DESC`;
        const [rows] = await db.query(query);
        res.json(procesarImagenes(rows));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener hoteles' });
    }
};

export const getHotelById = async (req, res) => {
    try {
        const query = `${SELECT_BASE} WHERE h.id_hotel = ? ${GROUP_BY}`;
        const [rows] = await db.query(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "No encontrado" });
        
        const hotelProcesado = procesarImagenes(rows)[0];
        res.json(hotelProcesado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener hotel' });
    }
};

// ... (crear, actualizar y eliminar se mantienen igual o similares)
export const crearHotel = async (req, res) => {
    try {
        const [result] = await db.query('INSERT INTO hoteles SET ?', [req.body]);
        res.status(201).json({ id: result.insertId, message: 'Hotel creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear hotel' });
    }
};

export const actualizarHotel = async (req, res) => {
    try {
        await db.query('UPDATE hoteles SET ? WHERE id_hotel = ?', [req.body, req.params.id]);
        res.json({ message: "Hotel actualizado" });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

export const eliminarHotel = async (req, res) => {
    try {
        await db.query('UPDATE hoteles SET activo = 0 WHERE id_hotel = ?', [req.params.id]);
        res.json({ message: "Hotel desactivado" });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};