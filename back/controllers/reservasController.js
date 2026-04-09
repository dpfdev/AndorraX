import db from '../config/db.js';

// --- OBTENER LAS RESERVAS DEL USUARIO LOGUEADO ---
export const obtenerMisReservas = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const query = `
            SELECT r.*, 
            u.nombre as nombre_usuario, u.email as email_usuario,
            CASE 
                WHEN r.tipo_objeto = 'hotel' THEN (SELECT nombre FROM hoteles WHERE id_hotel = r.id_objeto)
                WHEN r.tipo_objeto = 'actividad' THEN (SELECT nombre FROM actividades WHERE id_actividad = r.id_objeto)
                WHEN r.tipo_objeto = 'evento' THEN (SELECT nombre FROM eventos WHERE id_evento = r.id_objeto)
            END as nombre_item
            FROM reserva r
            JOIN usuarios u ON r.id_usuario = u.id_usuario
            WHERE r.id_usuario = ?
            ORDER BY r.fecha_reserva DESC
        `;
        
        const [rows] = await db.query(query, [id_usuario]);
        res.json(rows);
    } catch (error) {
        console.error("Error en obtenerMisReservas:", error);
        res.status(500).json({ error: "Error al obtener el historial de reservas" });
    }
};

// --- RESERVAR UN HOTEL ---
export const reservarHotel = async (req, res) => {
    const { id_hotel, fecha_entrada, fecha_salida, precio_total } = req.body;
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, fecha_fin, precio) 
             VALUES (?, 'hotel', ?, NOW(), 'confirmada', ?, ?, ?)`,
            [req.usuario.id, id_hotel, fecha_entrada, fecha_salida, precio_total]
        );
        res.status(201).json({ message: "Reserva de hotel realizada con éxito" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Fallo al procesar la reserva del hotel" }); 
    }
};

// --- RESERVAR UNA ACTIVIDAD ---
export const reservarActividad = async (req, res) => {
    const { id_actividad, fecha, precio_total } = req.body;
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, precio) 
             VALUES (?, 'actividad', ?, NOW(), 'confirmada', ?, ?)`,
            [req.usuario.id, id_actividad, fecha, precio_total]
        );
        res.status(201).json({ message: "Actividad reservada con éxito" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Fallo al reservar la actividad" }); 
    }
};

// --- RESERVAR UN EVENTO ---
export const reservarEvento = async (req, res) => {
    const { id_evento, fecha, precio_total } = req.body;
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, precio) 
             VALUES (?, 'evento', ?, NOW(), 'confirmada', ?, ?)`,
            [req.usuario.id, id_evento, fecha, precio_total]
        );
        res.status(201).json({ message: "Entrada para evento reservada" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Fallo al reservar el evento" }); 
    }
};