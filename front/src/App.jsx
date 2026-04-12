import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ActividadDetalle from '../pages/ActividadDetalle';
import Actividades from '../pages/Actividades';
import AndorraLogin from '../pages/AndorraLogin';
import EventoDetalle from '../pages/EventoDetalle';
import Eventos from '../pages/Eventos';
import Home from '../pages/Home';
import HotelDetalle from '../pages/HotelDetalle';
import HotelesListado from '../pages/HotelesListado';
import MisReservas from '../pages/MisReservas';
import Registro from '../pages/Registro';
import './index.css';

function App() {
  // Estado para el tema: 'dark' por defecto (ciberpunk/ártico)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Aplicar el tema al cambiar el estado y guardarlo en localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      {/* La clase 'light-mode' se aplica al contenedor principal 
          basándose en el estado. Esto activará las variables CSS 
          que definimos en DetalleCyber.css 
      */}
      <div className={`app-container ${theme === 'light' ? 'light-mode' : ''}`} 
           style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Pasamos toggleTheme y el tema actual al Navbar para que puedas poner un botón de cambio */}
        <Navbar toggleTheme={toggleTheme} currentTheme={theme} />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Rutas de Hoteles */}
            <Route path="/hoteles" element={<HotelesListado />} />
            <Route path="/hoteles/:id" element={<HotelDetalle />} />
            
            {/* Rutas de Actividades */}
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/actividades/:id" element={<ActividadDetalle />} />
            
            {/* Rutas de Eventos */}
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalle />} />
            
            {/* Rutas de Usuario */}
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/login" element={<AndorraLogin />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;