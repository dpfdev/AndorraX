import express from 'express';
import { confirmarCuenta, login, registrar } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/registrar
 * @desc    Registra un nuevo usuario y envía email de confirmación
 */
router.post('/registrar', registrar);

/**
 * @route   POST /api/auth/login
 * @desc    Inicia sesión y devuelve un JWT (Solo si la cuenta está verificada)
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/confirmar/:token
 * @desc    Activa la cuenta del usuario mediante el token recibido por email
 */
router.get('/confirmar/:token', confirmarCuenta);

export default router;