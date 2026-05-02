import db from '../config/db.js';

// --- FUNCIÓN: OBTENER MIS RESERVAS (Con Nombres e Imágenes) ---
export const obtenerMisReservas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.*, 
                u.nombre AS nombre_usuario,
                i.url AS imagen_url,
                COALESCE(h.nombre, a.nombre, e.nombre) AS nombre_objeto
            FROM reserva r
            LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
            LEFT JOIN imagenes i ON i.id_objeto = r.id_objeto AND i.tipo_objeto = r.tipo_objeto
            LEFT JOIN hoteles h ON r.id_objeto = h.id_hotel AND r.tipo_objeto = 'hotel'
            LEFT JOIN actividades a ON r.id_objeto = a.id_actividad AND r.tipo_objeto = 'actividad'
            LEFT JOIN eventos e ON r.id_objeto = e.id_evento AND r.tipo_objeto = 'evento'
            WHERE r.id_usuario = ?
            GROUP BY r.id_reserva
            ORDER BY r.fecha_inicio DESC
        `, [req.user.id]);
        
        res.json(rows);
    } catch (e) {
        console.error("Error en obtenerMisReservas:", e);
        res.status(500).json({ error: e.message });
    }
};

// --- FUNCIÓN: ELIMINAR RESERVA ---
export const eliminarReserva = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM reserva WHERE id_reserva = ?', [id]);
        res.json({ message: 'Reserva eliminada con éxito' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// --- LAS DEMÁS FUNCIONES (reservarHotel, etc. se mantienen igual) ---
export const reservarHotel = async (req, res) => {
    const { id_objeto, fecha_inicio, fecha_fin, precio } = req.body;
    const id_usuario = req.user.id;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [reserva] = await connection.query(
            'INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_inicio, fecha_fin, precio, estado) VALUES (?, "hotel", ?, ?, ?, ?, "confirmada")',
            [id_usuario, id_objeto, fecha_inicio, fecha_fin, precio]
        );
        await connection.query('INSERT INTO reservas_hoteles (id_reserva, id_hotel) VALUES (?, ?)', [reserva.insertId, id_objeto]);
        await connection.commit();
        res.status(201).json({ message: 'Hotel reservado' });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally { connection.release(); }
};

export const reservarActividad = async (req, res) => {
    const { id_objeto, fecha_inicio, precio } = req.body;
    const id_usuario = req.user.id;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [reserva] = await connection.query(
            'INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_inicio, precio, estado) VALUES (?, "actividad", ?, ?, ?, "confirmada")',
            [id_usuario, id_objeto, fecha_inicio, precio]
        );
        await connection.query('INSERT INTO reservas_actividades (id_reserva, id_actividad) VALUES (?, ?)', [reserva.insertId, id_objeto]);
        await connection.commit();
        res.status(201).json({ message: 'Actividad reservada' });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally { connection.release(); }
};

export const reservarEvento = async (req, res) => {
    const { id_objeto, fecha_inicio, precio } = req.body;
    const id_usuario = req.user.id;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [reserva] = await connection.query(
            'INSERT INTO reserva (id_usuario, tipo_objeto, id_objeto, fecha_inicio, precio, estado) VALUES (?, "evento", ?, ?, ?, "confirmada")',
            [id_usuario, id_objeto, fecha_inicio, precio]
        );
        await connection.query('INSERT INTO reservas_eventos (id_reserva, id_evento) VALUES (?, ?)', [reserva.insertId, id_objeto]);
        await connection.commit();
        res.status(201).json({ message: 'Evento reservado' });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally { connection.release(); }
};