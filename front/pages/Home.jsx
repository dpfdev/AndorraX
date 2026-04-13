import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Map } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import api from '../src/services/api';
import './Home.css';

const Home = () => {
  const [data, setData] = useState({ hoteles: [], actividades: [], eventos: [] });
  const URL_BASE = "http://localhost:3000";
  const DEFAULT_IMAGE = "/hero.jpg"; 

  // CARGA DE DATOS API
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
      } catch (err) { console.error("Error cargando datos:", err); }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Capa de profundidad visual */}
      <div className="bg-vignette"></div>

      {/* HERO SECTION: ENFOQUE TOTAL EN EL IMPACTO VISUAL */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="badge-promo">TEMPORADA 2026 // ANDORRA</div>
          <h1 className="glitch-text">ANDORRA<span>X</span></h1>
          <p className="hero-subtitle">Donde la nieve se encuentra con el lujo</p>
          <Link to="/actividades" className="cta-button-main">EXPLORAR AHORA</Link>
          
          <div className="mouse-scroll">
            <div className="mouse"></div>
          </div>
        </motion.div>
      </header>

      <main className="container">
        
        {/* SECCIÓN HOTELES */}
        <section className="home-section">
          <div className="section-header">
            <div className="header-title">
              <p className="section-category">STAY</p>
              <h2>Refugios de Alta Montaña</h2>
            </div>
            <Link to="/hoteles" className="view-all">Ver catálogo <ArrowRight size={18}/></Link>
          </div>
          <div className="content-grid">
            {data.hoteles.map(h => (
              <motion.div key={h.id_hotel} whileHover={{ y: -10 }}>
                <HotelCard hotel={h} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECCIÓN ACTIVIDADES */}
        <section className="home-section">
          <div className="section-header">
            <div className="header-title">
              <p className="section-category">ADRENALINE</p>
              <h2>Experiencias Exclusivas</h2>
            </div>
          </div>
          <div className="content-grid">
             {data.actividades.map(act => (
                <Link to={`/actividades/${act.id_actividad}`} key={act.id_actividad} className="cyber-card">
                  <div className="card-media">
                    <div className="price-tag">{act.precio}€</div>
                    <img src={act.foto_principal ? `${URL_BASE}${act.foto_principal}` : DEFAULT_IMAGE} alt={act.nombre} />
                    <div className="card-glow blue"></div>
                  </div>
                  <div className="card-body">
                    <h4>{act.nombre}</h4>
                    <div className="card-meta">
                       <Map size={14}/> <span>{act.ciudad || 'Andorra'}</span>
                    </div>
                  </div>
                </Link>
             ))}
          </div>
        </section>

        {/* SECCIÓN EVENTOS */}
        <section className="home-section">
          <div className="section-header header-purple">
            <div className="header-title">
              <p className="section-category">VIBES</p>
              <h2>Après-Ski & Cultura</h2>
            </div>
            <Link to="/eventos" className="view-all">Agenda completa <Calendar size={18}/></Link>
          </div>
          <div className="content-grid">
            {data.eventos.map(ev => (
              <Link to={`/eventos/${ev.id_evento}`} key={ev.id_evento} className="cyber-card event-variant">
                <div className="card-media">
                  <div className="event-label">LIVE</div>
                  <img src={ev.foto_principal ? `${URL_BASE}${ev.foto_principal}` : DEFAULT_IMAGE} alt={ev.nombre} />
                  <div className="card-glow purple"></div>
                </div>
                <div className="card-body">
                  <h4>{ev.nombre}</h4>
                  <div className="card-meta">
                    <Calendar size={14} color="var(--neon-purple)"/> 
                    <span>{new Date(ev.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
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