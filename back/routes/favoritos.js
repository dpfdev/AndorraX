import express from 'express';
import * as favCtrl from '../controllers/favoritosController.js';
import { verificarUsuario } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', verificarUsuario, favCtrl.añadirFavorito);
router.get('/', verificarUsuario, favCtrl.getMisFavoritos);
router.delete('/:id', verificarUsuario, favCtrl.eliminarFavorito);
export default router;