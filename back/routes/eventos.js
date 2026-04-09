import express from 'express';
import * as eventoCtrl from '../controllers/eventosController.js';

const router = express.Router();

// 1. Ruta de búsqueda (Línea 7, donde daba el error)
router.get('/buscar', eventoCtrl.buscarEventos);

// 2. Ruta para listar todos (Asegúrate de que el nombre sea getEventos)
router.get('/', eventoCtrl.getEventos);

// 3. Ruta para detalle por ID
router.get('/:id', eventoCtrl.getEventoById);

export default router;