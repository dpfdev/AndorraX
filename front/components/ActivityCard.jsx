import { ChevronRight, Clock, Mountain, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ActivityCard.css';

const ActivityCard = ({ actividad }) => {
  const URL_BASE = "http://localhost:3000";

  return (
    <div className="ski-card">
      <div className="image-wrapper">
        <img 
          src={actividad.foto_principal ? `${URL_BASE}${actividad.foto_principal}` : 'https://images.unsplash.com/photo-1517176118179-65244903d13c'} 
          alt={actividad.nombre} 
        />
        <div className="ski-badge">
           <Zap size={14} /> {actividad.nivel_dificultad || 'AVENTURA'}
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{actividad.nombre}</h3>
          <div className="duration-tag">
            <Clock size={14} />
            <span>{actividad.duracion_estimada || 'Consultar'}</span>
          </div>
        </div>

        <div className="location-tag">
          <Mountain size={14} /> 
          {/* Usamos actividad.ciudad que es lo que devuelve tu query */}
          <span>{actividad.ciudad || 'ANDORRA'}, ANDORRA</span>
        </div>
        
        <p className="card-description-short">
          {actividad.descripcion_breve || 'Disfruta de una experiencia exclusiva en el corazón de los Pirineos.'}
        </p>
        
        <div className="card-footer">
          <div className="price-box">
            <span className="price-label">reserva desde</span>
            {/* Cambiado a actividad.precio para coincidir con tu Backend */}
            <span className="price-val">{actividad.precio}€</span>
          </div>
          <Link to={`/actividades/${actividad.id_actividad}`} className="ski-button">
            EXPLORAR <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;