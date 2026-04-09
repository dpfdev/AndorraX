import express from 'express';
const router = express.Router();
// IMPORTANTE: Asegúrate de que los nombres coincidan exactamente con el controlador
import { buscarActividades, getActividadById, getAllActividades } from '../controllers/actividadController.js';

// Si alguna de estas funciones es "undefined", Node lanzará el error que ves
router.get('/', getAllActividades); 
router.get('/buscar', buscarActividades);
router.get('/:id', getActividadById);

export default router;