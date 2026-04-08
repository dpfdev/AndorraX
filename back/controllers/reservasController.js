import db from '../config/db.js';

// --- OBTENER HISTORIAL CON NOMBRES ---
export const obtenerMisReservas = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const query = `
            SELECT r.*, 
            CASE 
                WHEN r.tipo_objeto = 'hotel' THEN (SELECT nombre FROM hoteles WHERE id_hotel = r.id_objeto)
                WHEN r.tipo_objeto = 'actividad' THEN (SELECT nombre FROM actividades WHERE id_actividad = r.id_objeto)
                WHEN r.tipo_objeto = 'evento' THEN (SELECT nombre FROM eventos WHERE id_evento = r.id_objeto)
            END as nombre_item
            FROM reserva r
            WHERE r.id_usuario = ?
            ORDER BY r.fecha_reserva DESC
        `;
        const [rows] = await db.query(query, [id_usuario]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
};

// --- RESERVAR HOTEL ---
export const reservarHotel = async (req, res) => {
    const { id_hotel, fecha_entrada, fecha_salida, personas, precio_total } = req.body;
    const id_usuario = req.usuario.id;
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, fecha_fin, precio) 
             VALUES (?, 'hotel', ?, NOW(), 'confirmada', ?, ?, ?)`,
            [id_usuario, id_hotel, fecha_entrada, fecha_salida, precio_total]
        );
        res.status(201).json({ message: "Hotel reservado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// --- RESERVAR ACTIVIDAD ---
export const reservarActividad = async (req, res) => {
    const { id_actividad, fecha, personas, precio_total } = req.body;
    const id_usuario = req.usuario.id;
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, precio) 
             VALUES (?, 'actividad', ?, NOW(), 'confirmada', ?, ?)`,
            [id_usuario, id_actividad, fecha, precio_total]
        );
        res.status(201).json({ message: "Actividad reservada" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// --- RESERVAR EVENTO ---
export const reservarEvento = async (req, res) => {
    const { id_evento, fecha, entradas, precio_total } = req.body;
    const id_usuario = req.usuario.id;
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, precio) 
             VALUES (?, 'evento', ?, NOW(), 'confirmada', ?, ?)`,
            [id_usuario, id_evento, fecha, precio_total]
        );
        res.status(201).json({ message: "Evento reservado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};