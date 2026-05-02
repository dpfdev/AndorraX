import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Componentes Globales
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Páginas
import ActividadDetalle from '../pages/ActividadDetalle';
import Actividades from '../pages/Actividades';
import AndorraLogin from '../pages/AndorraLogin';
import EventoDetalle from '../pages/EventoDetalle';
import Eventos from '../pages/Eventos'; // Asegúrate de tener esta página creada
import Home from '../pages/Home';
import HotelDetalle from '../pages/HotelDetalle';
import HotelesListado from '../pages/HotelesListado';
import MisReservas from '../pages/MisReservas';

// Estilos globales
import './index.css';

function App() {
  // 1. LÓGICA DE TEMA: Iniciamos en 'light' por defecto
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // 2. Aplicamos/Quitamos la clase 'dark' al HTML para que afecte a TODA la app
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Guardamos la preferencia
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      {/* Notificaciones globales */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="app-wrapper">
        {/* Pasamos el tema y la función a la Navbar para el botón del sol/luna */}
        <Navbar toggleTheme={toggleTheme} currentTheme={theme} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Rutas de Hoteles */}
            <Route path="/hoteles" element={<HotelesListado />} />
            <Route path="/hoteles/:id" element={<HotelDetalle />} />
            
            {/* Rutas de Actividades */}
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/actividades/:id" element={<ActividadDetalle />} />
            
            {/* Ruta de Eventos (A donde redirige el botón de MisReservas) */}
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalle/>}/>
            
            {/* Gestión de Reservas y Usuario */}
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/login" element={<AndorraLogin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;