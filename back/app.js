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

// Configuración de CORS única
app.use(cors({
    origin: ["andorra-x-omega.vercel.app","http://localhost:5173"],    
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Archivos estáticos (OJO con esto en Vercel, lee la nota abajo)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Registro de Rutas ---
app.use('/api/hoteles', hotelesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/imagenes', imagenesRoutes);

// Middleware de error
app.use(errorHandler);

// Esto es importante para local, pero Vercel usará su propia gestión de puertos
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}

export default app; // Exportación necesaria para Vercel