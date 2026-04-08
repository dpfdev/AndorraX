import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import imagenesRoutes from './routes/imagenes.js';

// Importar Rutas
import { errorHandler } from './middlewares/errorMiddleware.js';
import actividadesRoutes from './routes/actividades.js';
import categoriasRoutes from './routes/categorias.js';
import eventosRoutes from './routes/eventos.js';
import favoritosRoutes from './routes/favoritos.js';
import hotelesRoutes from './routes/hoteles.js';
import resenasRoutes from './routes/resenas.js';
import reservasRoutes from './routes/reservas.js';
// En tu app.js del backend
import authRoutes from './routes/auth.js';


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middlewares iniciales
app.use(cors({
    origin: '*', // En desarrollo puedes usar '*' para permitir todo
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir imágenes (Crea una carpeta llamada 'uploads' en la raíz)

// Registro de Rutas
app.use('/api/hoteles', hotelesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/auth', authRoutes); // <--- Si aquí dice /api/auth...
app.use('/api/imagenes', imagenesRoutes); // Ruta para subir imágenes


// Middleware de error (SIEMPRE al final de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});