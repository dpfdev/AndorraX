import { ChevronRight, Mountain, Snowflake, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
  const URL_BASE = "http://localhost:3000";

  return (
    <div className="ski-card">
      <div className="image-wrapper">
        <img 
          src={hotel.foto_principal ? `${URL_BASE}${hotel.foto_principal}` : 'https://images.unsplash.com/photo-1551882547-ff43c639f675'} 
          alt={hotel.nombre} 
        />
        <div className="ski-badge">
           <Snowflake size={14} /> SKI-IN / SKI-OUT
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{hotel.nombre}</h3>
          <div className="stars-container">
            {[...Array(hotel.categoria_estrellas)].map((_, i) => (
              <Star key={i} size={14} fill="#ffcc00" color="#ffcc00" />
            ))}
          </div>
        </div>

        <div className="location-tag">
          <Mountain size={14} /> 
          <span>{hotel.ciudad}, ANDORRA</span>
        </div>
        
        <div className="card-footer">
          <div className="price-box">
            <span className="price-label">desde</span>
            <span className="price-val">{hotel.precio_base_noche}€</span>
          </div>
          <Link to={`/hoteles/${hotel.id_hotel}`} className="ski-button">
            DETALLES <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;