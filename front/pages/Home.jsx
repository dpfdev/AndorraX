import { ArrowRight, Clock, Map } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [data, setData] = useState({ hoteles: [], actividades: [], eventos: [] });
  const URL_BASE = "http://localhost:3000";
  // Usamos tu imagen local como imagen por defecto
  const DEFAULT_IMAGE = "/hero.jpg"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [h, a, e] = await Promise.all([
          api.get('/hoteles'), 
          api.get('/actividades'),
          api.get('/eventos')
        ]);
        setData({ 
            hoteles: h.data.slice(0, 3), 
            actividades: a.data.slice(0, 3), 
            eventos: e.data.slice(0, 3) 
        });
      } catch (err) { 
        console.error("Error cargando datos:", err); 
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge-promo">TEMPORADA 2026</div>
          <h1>ANDORRA<span>X</span></h1>
          <p className="hero-subtitle">Donde la nieve se encuentra con el lujo</p>
          <Link to="/actividades" className="cta-button-main">EXPLORAR AHORA</Link>
        </div>
      </header>

      <main className="container">
        
        {/* HOTELES */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <p className="section-category">STAY</p>
              <h2>Refugios de Alta Montaña</h2>
            </div>
            <Link to="/hoteles" className="view-all">Ver catálogo <ArrowRight size={18}/></Link>
          </div>
          <div className="hotels-grid">
            {data.hoteles.map(h => <HotelCard key={h.id_hotel} hotel={h} />)}
          </div>
        </section>

        {/* ACTIVIDADES */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <p className="section-category">ADRENALINE</p>
              <h2>Experiencias Exclusivas</h2>
            </div>
          </div>
          <div className="hotels-grid">
             {data.actividades.map(act => (
                <Link to={`/actividades/${act.id_actividad}`} key={act.id_actividad} className="ski-card mini">
                  <div className="card-image-wrapper">
                    <div className="price-tag">{act.precio}€</div>
                    <img 
                      src={act.foto_principal ? `${URL_BASE}${act.foto_principal}` : DEFAULT_IMAGE} 
                      alt={act.nombre} 
                      className="card-image-full"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <h4>{act.nombre}</h4>
                    <div className="card-footer-info">
                       <Map size={14}/> <span>{act.ciudad || 'Andorra'}</span>
                    </div>
                  </div>
                </Link>
             ))}
          </div>
        </section>

        {/* EVENTOS */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <p className="section-category">EVENTS</p>
              <h2>Après-Ski & Cultura</h2>
            </div>
          </div>
          <div className="hotels-grid">
            {data.eventos.map(ev => (
                <Link to={`/eventos/${ev.id_evento}`} key={ev.id_evento} className="ski-card mini">
                  <div className="card-image-wrapper">
                    <div className="price-tag event-tag">EVENTO</div>
                    <img 
                      src={ev.foto_principal ? `${URL_BASE}${ev.foto_principal}` : DEFAULT_IMAGE} 
                      alt={ev.nombre} 
                      className="card-image-full"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <h4>{ev.nombre}</h4>
                    <div className="card-date-info">
                      <Clock size={14} /> <span>{new Date(ev.fecha_inicio).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;