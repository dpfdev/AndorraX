import express from 'express';
import * as hotelCtrl from '../controllers/hotelesController.js';
import { verificarAdmin, verificarUsuario } from '../middlewares/auth.js';

const router = express.Router();

// Si el error daba en la línea 8, era por uno de estos nombres:
router.get('/buscar', hotelCtrl.buscarHoteles);
router.get('/', hotelCtrl.getAllHoteles);
router.get('/:id', hotelCtrl.getHotelById);

// Rutas Admin
router.post('/', verificarUsuario, verificarAdmin, hotelCtrl.crearHotel);
router.put('/:id', verificarUsuario, verificarAdmin, hotelCtrl.actualizarHotel);
router.delete('/:id', verificarUsuario, verificarAdmin, hotelCtrl.eliminarHotel);

export default router;