import express from 'express';
import { obtenerMisReservas, reservarActividad, reservarEvento, reservarHotel } from '../controllers/reservasController.js';
<<<<<<< HEAD
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verificarToken); // Protege todas las rutas

router.get('/mis-reservas', obtenerMisReservas);
router.post('/hotel', reservarHotel);      // URL final: /api/reservas/hotel
router.post('/actividad', reservarActividad); // URL final: /api/reservas/actividad
router.post('/evento', reservarEvento);       // URL final: /api/reservas/evento
=======
import { verificarToken } from '../middlewares/auth.js'; // <--- Verifica que la carpeta tenga la 's'

const router = express.Router();

// Aplicar el middleware a todas las rutas de este archivo
router.use(verificarToken);

router.get('/mis-reservas', obtenerMisReservas);
router.post('/hotel', reservarHotel);
router.post('/actividad', reservarActividad);
router.post('/evento', reservarEvento);
>>>>>>> 0d404fab54085fa2163fa6e1a2d409567d4145b9

export default router;