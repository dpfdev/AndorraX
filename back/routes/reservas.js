import express from 'express';
import { obtenerMisReservas, reservarActividad, reservarEvento, reservarHotel } from '../controllers/reservasController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Aplicar el middleware a todas las rutas de este archivo
router.use(verificarToken);

router.get('/mis-reservas', obtenerMisReservas);
router.post('/hotel', reservarHotel);
router.post('/actividad', reservarActividad);
router.post('/evento', reservarEvento);

export default router;