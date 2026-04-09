import express from 'express';
import * as resCtrl from '../controllers/resenasController.js';
import { verificarUsuario } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', verificarUsuario, resCtrl.publicarResena);
router.get('/:tipo/:id', resCtrl.getResenasPorObjeto);
router.delete('/:id', verificarUsuario, resCtrl.eliminarResena);
export default router;