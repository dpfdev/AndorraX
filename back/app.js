import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar Rutas
import { errorHandler } from './middlewares/errorMiddleware.js';
import actividadesRoutes from './routes/actividades.js';
import authRoutes from './routes/auth.js';
import categoriasRoutes from './routes/categorias.js';
import eventosRoutes from './routes/eventos.js';
import favoritosRoutes from './routes/favoritos.js';
import hotelesRoutes from './routes/hoteles.js';
import imagenesRoutes from './routes/imagenes.js';
import resenasRoutes from './routes/resenas.js';
import reservasRoutes from './routes/reservas.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middlewares ---

// Configuración de CORS corregida
app.use(cors({
    origin: ["https://andorra-x-omega.vercel.app", "http://localhost:5173"],    
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Añadido OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Registro de Rutas ---
app.use('/api/auth', authRoutes); // /api/auth/registrar
app.use('/api/hoteles', hotelesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/imagenes', imagenesRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
}

export default app;