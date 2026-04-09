import express from 'express';
// ... otros imports de controladores
import { verificarAdmin, verificarUsuario } from '../middlewares/auth.js';

const router = express.Router();

// Ejemplo de uso en tus rutas de categorías
router.get('/', verificarUsuario, (req, res) => { /* ... */ });
router.post('/', verificarAdmin, (req, res) => { /* ... */ });

export default router;