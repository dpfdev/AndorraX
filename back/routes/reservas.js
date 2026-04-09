import express from 'express';
import { obtenerMisReservas, reservarActividad, reservarEvento, reservarHotel } from '../controllers/reservasController.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verificarToken); // Protege todas las rutas

router.get('/mis-reservas', obtenerMisReservas);
router.post('/hotel', reservarHotel);      // URL final: /api/reservas/hotel
router.post('/actividad', reservarActividad); // URL final: /api/reservas/actividad
router.post('/evento', reservarEvento);       // URL final: /api/reservas/evento

export default router;