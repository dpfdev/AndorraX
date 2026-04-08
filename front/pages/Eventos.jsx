import { ArrowRight, Clock, Map, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const URL_BASE = "http://localhost:3000";
  const DEFAULT_IMAGE = "/hero.jpg"; // Tu imagen local segura

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

  // Detiene el bucle infinito si la imagen del servidor o de internet falla
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="eventos-page">
      <header className="eventos-header">
        <div className="container">
          <div className="header-badge">AGENDA 2026</div>
          <h1>Après-Ski & <span>Eventos</span></h1>
          <p>La mejor música, gastronomía y cultura en la nieve</p>
        </div>
      </header>

      <main className="container">
        <div className="eventos-grid">
          {eventos.map((ev) => (
            <Link to={`/eventos/${ev.id_evento}`} key={ev.id_evento} className="evento-card">
              <div className="evento-image-wrapper">
                <div className="date-badge">
                  <span className="day">{new Date(ev.fecha_inicio).getDate()}</span>
                  <span className="month">
                    {new Date(ev.fecha_inicio).toLocaleString('es-ES', { month: 'short' }).toUpperCase()}
                  </span>
                </div>
                <img 
                  src={ev.foto_principal ? `${URL_BASE}${ev.foto_principal}` : DEFAULT_IMAGE} 
                  alt={ev.nombre} 
                  className="evento-image"
                  onError={handleImageError}
                />
              </div>
              
              <div className="evento-body">
                <div className="evento-category">
                  <Music size={14} /> <span>Cultura & Ocio</span>
                </div>
                <h3>{ev.nombre}</h3>
                <div className="evento-details">
                  <div className="detail">
                    <Map size={16} /> <span>{ev.lugar || 'Grandvalira'}</span>
                  </div>
                  <div className="detail">
                    <Clock size={16} /> <span>{new Date(ev.fecha_inicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                <p className="evento-excerpt">
                  {ev.descripcion ? ev.descripcion.substring(0, 90) + '...' : 'Únete a nosotros para una experiencia inolvidable en Andorra.'}
                </p>
                <div className="evento-footer">
                  <span className="more-info">Más información <ArrowRight size={16} /></span>
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