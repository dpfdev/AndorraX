import db from '../config/db.js';

<<<<<<< HEAD
=======
// --- OBTENER HISTORIAL CON NOMBRES ---
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
export const obtenerMisReservas = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const query = `
            SELECT r.*, 
<<<<<<< HEAD
            u.nombre as nombre_usuario, u.email as email_usuario,
=======
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
            CASE 
                WHEN r.tipo_objeto = 'hotel' THEN (SELECT nombre FROM hoteles WHERE id_hotel = r.id_objeto)
                WHEN r.tipo_objeto = 'actividad' THEN (SELECT nombre FROM actividades WHERE id_actividad = r.id_objeto)
                WHEN r.tipo_objeto = 'evento' THEN (SELECT nombre FROM eventos WHERE id_evento = r.id_objeto)
            END as nombre_item
            FROM reserva r
<<<<<<< HEAD
            JOIN usuarios u ON r.id_usuario = u.id_usuario
=======
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
            WHERE r.id_usuario = ?
            ORDER BY r.fecha_reserva DESC
        `;
        const [rows] = await db.query(query, [id_usuario]);
        res.json(rows);
    } catch (error) {
<<<<<<< HEAD
        console.error("Error en obtenerMisReservas:", error);
        res.status(500).json({ error: "Error al obtener historial de reservas" });
    }
};

export const reservarHotel = async (req, res) => {
    const { id_hotel, fecha_entrada, fecha_salida, precio_total } = req.body;
=======
        res.status(500).json({ error: "Error al obtener historial" });
    }
};

// --- RESERVAR HOTEL ---
export const reservarHotel = async (req, res) => {
    const { id_hotel, fecha_entrada, fecha_salida, personas, precio_total } = req.body;
    const id_usuario = req.usuario.id;
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, fecha_fin, precio) 
             VALUES (?, 'hotel', ?, NOW(), 'confirmada', ?, ?, ?)`,
<<<<<<< HEAD
            [req.usuario.id, id_hotel, fecha_entrada, fecha_salida, precio_total]
        );
        res.status(201).json({ message: "Reserva completada" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const reservarActividad = async (req, res) => {
    const { id_actividad, fecha, precio_total } = req.body;
=======
            [id_usuario, id_hotel, fecha_entrada, fecha_salida, precio_total]
        );
        res.status(201).json({ message: "Hotel reservado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// --- RESERVAR ACTIVIDAD ---
export const reservarActividad = async (req, res) => {
    const { id_actividad, fecha, personas, precio_total } = req.body;
    const id_usuario = req.usuario.id;
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, precio) 
             VALUES (?, 'actividad', ?, NOW(), 'confirmada', ?, ?)`,
<<<<<<< HEAD
            [req.usuario.id, id_actividad, fecha, precio_total]
=======
            [id_usuario, id_actividad, fecha, precio_total]
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
        );
        res.status(201).json({ message: "Actividad reservada" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

<<<<<<< HEAD
export const reservarEvento = async (req, res) => {
    const { id_evento, fecha, precio_total } = req.body;
=======
// --- RESERVAR EVENTO ---
export const reservarEvento = async (req, res) => {
    const { id_evento, fecha, entradas, precio_total } = req.body;
    const id_usuario = req.usuario.id;
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
    try {
        await db.query(
            `INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_reserva, estado, fecha_inicio, precio) 
             VALUES (?, 'evento', ?, NOW(), 'confirmada', ?, ?)`,
<<<<<<< HEAD
            [req.usuario.id, id_evento, fecha, precio_total]
=======
            [id_usuario, id_evento, fecha, precio_total]
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9
        );
        res.status(201).json({ message: "Evento reservado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};