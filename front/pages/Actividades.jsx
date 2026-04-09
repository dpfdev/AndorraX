import { ArrowRight, Clock, Map } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Actividades.css'; // Asegúrate de que el nombre coincida

const Actividades = () => {
  const [actividades, setActividades] = useState([]);
  const URL_BASE = "http://localhost:3000";
  const DEFAULT_IMAGE = "/hero.jpg"; // Usamos tu imagen local que sí funciona

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await api.get('/actividades');
        setActividades(res.data);
      } catch (err) {
        console.error("Error cargando actividades:", err);
      }
    };
    fetchActividades();
  }, []);

  // Función crítica para detener el bucle infinito
  const handleImageError = (e) => {
    e.target.onerror = null; // Desactiva el manejador para que no vuelva a intentar si falla
    e.target.src = DEFAULT_IMAGE; // Cambia la imagen fallida por tu hero local
  };

  return (
    <div className="actividades-page">
      <header className="page-header">
        <div className="container">
          <h1>Experiencias en <span>Andorra</span></h1>
          <p>Adrenalina y relax en el corazón de los Pirineos</p>
        </div>
      </header>

      <main className="container">
        <div className="activities-grid">
          {actividades.map((act) => (
            <Link to={`/actividades/${act.id_actividad}`} key={act.id_actividad} className="activity-card">
              <div className="activity-image-wrapper">
                <div className="price-badge">{act.precio}€</div>
                <img 
                  src={act.foto_principal ? `${URL_BASE}${act.foto_principal}` : DEFAULT_IMAGE} 
                  alt={act.nombre} 
                  className="activity-image"
                  onError={handleImageError} 
                />
              </div>
              <div className="activity-info">
                <h3>{act.nombre}</h3>
                <div className="activity-meta">
                  <span className="meta-item">
                    <Map size={16} /> {act.ciudad || 'Andorra'}
                  </span>
                  <span className="meta-item">
                    <Clock size={16} /> {act.duracion || 'Consultar'}
                  </span>
                </div>
                <p className="activity-description">
                  {act.descripcion ? act.descripcion.substring(0, 100) + '...' : 'Descubre esta increíble actividad en la nieve.'}
                </p>
                <div className="activity-footer">
                  <span className="btn-details">Ver detalles <ArrowRight size={16} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Actividades;