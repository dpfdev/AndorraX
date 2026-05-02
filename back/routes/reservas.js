import express from 'express';
import {
    eliminarReserva // <--- Importamos la nueva función
    ,
    obtenerMisReservas,
    reservarActividad,
    reservarEvento,
    reservarHotel
} from '../controllers/reservasController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// --- RUTAS DE CREACIÓN (POST) ---
router.post('/hotel', verificarToken, reservarHotel);
router.post('/actividad', verificarToken, reservarActividad);
router.post('/evento', verificarToken, reservarEvento);

// --- RUTAS DE CONSULTA (GET) ---
router.get('/mis-reservas', verificarToken, obtenerMisReservas);

// --- RUTAS DE ELIMINACIÓN (DELETE) ---
// El :id es un parámetro dinámico que recibirá el id_reserva desde el frontend
router.delete('/:id', verificarToken, eliminarReserva);

export default router;