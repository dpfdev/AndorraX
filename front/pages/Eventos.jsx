import { ArrowRight, Clock, MapPin, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../src/services/api';
import './Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const URL_BASE = "http://localhost:3000";
  const DEFAULT_IMAGE = "/hero.jpg"; 

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await api.get('/eventos');
        setEventos(res.data);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      }
    };
    fetchEventos();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="eventos-page-cyber">
      <header className="eventos-header-cyber">
        <div className="header-overlay"></div>
        <div className="container header-content">
          <div className="header-meta">/ AGENDA // 2026</div>
          <h1 className="glitch-title">Après-Ski & <span className="x-neon">Eventos</span></h1>
          <p className="header-subtitle">Sincroniza con la mejor música y cultura de Andorra</p>
        </div>
      </header>

      <main className="container">
        <div className="eventos-grid-cyber">
          {eventos.map((ev) => (
            <Link to={`/eventos/${ev.id_evento}`} key={ev.id_evento} className="evento-card-cyber">
              <div className="evento-media">
                <div className="date-tag-cyber">
                  <span className="day">{new Date(ev.fecha_inicio).getDate()}</span>
                  <span className="month">
                    {new Date(ev.fecha_inicio).toLocaleString('es-ES', { month: 'short' }).toUpperCase()}
                  </span>
                </div>
                <img 
                  src={ev.foto_principal ? `${URL_BASE}${ev.foto_principal}` : DEFAULT_IMAGE} 
                  alt={ev.nombre} 
                  className="evento-img"
                  onError={handleImageError}
                />
                <div className="card-glow-edge"></div>
              </div>
              
              <div className="evento-info">
                <div className="category-tag-cyber">
                  <Music size={14} className="icon-cyan" /> <span>CULTURA_DATA // 0{ev.id_evento}</span>
                </div>
                <h3>{ev.nombre}</h3>
                
                <div className="evento-meta-rows">
                  <div className="meta-item">
                    <MapPin size={16} className="icon-cyan" /> <span>{ev.lugar || 'ANDORRA_SECTOR'}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} className="icon-cyan" /> <span>{new Date(ev.fecha_inicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} HRS</span>
                  </div>
                </div>

                <p className="evento-description">
                  {ev.descripcion ? ev.descripcion.substring(0, 95) + '...' : 'Iniciando transmisión de experiencia alpina en alta resolución.'}
                </p>

                <div className="evento-action">
                  <span>VER DETALLES</span>
                  <ArrowRight size={18} className="arrow-icon" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Eventos;