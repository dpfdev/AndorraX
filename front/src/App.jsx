import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from '../components/Footer'; // Importamos el nuevo componente
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
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* El Navbar se mantiene fijo en la parte superior */}
        <Navbar />

        {/* El contenedor principal crece para empujar el footer hacia abajo */}
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

        {/* El Footer se renderiza en todas las rutas al final del documento */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;