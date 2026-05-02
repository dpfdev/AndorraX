import express from 'express';
import { confirmarCuenta, login, registrar, restablecerPassword, solicitarRecuperacion } from '../controllers/authController.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.get('/confirmar/:token', confirmarCuenta);
router.post('/olvide-password', solicitarRecuperacion);
router.post('/restablecer-password/:token', restablecerPassword);

export default router;