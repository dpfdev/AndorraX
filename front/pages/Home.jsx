import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Music, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ActivityCard from '../components/ActivityCard'; // Importamos el nuevo componente
import HotelCard from '../components/HotelCard';
import api from '../src/services/api'; // Corregida la ruta si es necesaria
import './Home.css';

const Home = () => {
  const [data, setData] = useState({ hoteles: [], actividades: [], eventos: [] });
  const URL_BASE = "http://localhost:3000";

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
      } catch (err) { console.error("Error al cargar datos:", err); }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container">
      {/* SECCIÓN HERO - TEMÁTICA SKI & ANDORRA */}
      <section className="hero-viewport">
        <div className="hero-visual">
          <div className="hero-gradient-top"></div>
          <img src="/hero.jpg" alt="Andorra Lujo" className="hero-img" />
          <div className="hero-gradient-bottom"></div>
        </div>

        <motion.div 
          className="hero-inner" 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <span className="hero-tag">
            <Sparkles size={14} /> EXPERIENCIA ALPINA 2026
          </span>
          <h1 className="hero-title">ANDORRA<span className="accent-x">X</span></h1>
          <p className="hero-desc">
            Donde el lujo se encuentra con la cumbre. Descubre refugios exclusivos, 
            pistas infinitas y la mejor vida nocturna de los Pirineos.
          </p>
          
          {/* Botones Unificados con la clase btn-hero */}
          <div className="hero-btns">
            <Link to="/hoteles" className="btn-hero">HOTELES</Link>
            <Link to="/actividades" className="btn-hero">ACTIVIDADES</Link>
            <Link to="/eventos" className="btn-hero">EVENTOS</Link>
          </div>
        </motion.div>
      </section>

      <main className="content-wrapper">
        
        {/* SECCIÓN: HOTELES (Luxury Collection) */}
        <section className="unified-section">
          <header className="section-meta">
            <div>
              <h2 className="section-label">ESTANCIAS</h2>
              <h3 className="section-title">Refugios de <span className="text-gradient">Alta Montaña</span></h3>
            </div>
            <Link to="/hoteles" className="link-more">Ver colección <ArrowRight size={18} /></Link>
          </header>
          <div className="unified-grid">
            {data.hoteles.map(h => (
              <motion.div key={h.id_hotel} whileHover={{ y: -10 }}>
                <HotelCard hotel={h} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECCIÓN: ACTIVIDADES (Ski & Adventure) */}
        <section className="unified-section">
          <header className="section-meta">
            <div>
              <h2 className="section-label category-cyan">ADRENALINA</h2>
              <h3 className="section-title">Aventura en la <span className="text-gradient">Nieve</span></h3>
            </div>
            <Link to="/actividades" className="link-more">Explorar pistas <ArrowRight size={18} /></Link>
          </header>
          <div className="unified-grid">
            {data.actividades.map(act => (
              <motion.div key={act.id_actividad} whileHover={{ y: -10 }}>
                {/* Usamos el nuevo ActivityCard aquí */}
                <ActivityCard actividad={act} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECCIÓN: EVENTOS (Après-Ski) */}
        <section className="unified-section">
          <header className="section-meta">
            <div>
              <h2 className="section-label category-purple">APRÈS-SKI</h2>
              <h3 className="section-title">Eventos <span className="text-gradient-purple">Exclusivos</span></h3>
            </div>
            <Link to="/eventos" className="link-more">Ver agenda <ArrowRight size={18} /></Link>
          </header>
          <div className="unified-grid">
            {data.eventos.map(ev => (
              <motion.div key={ev.id_evento} whileHover={{ y: -10 }}>
                <Link to={`/eventos/${ev.id_evento}`} className="pro-card event-variant">
                  <div className="pro-card-img">
                    <div className="pro-badge label-live">PREMIUM</div>
                    <img src={ev.foto_principal ? `${URL_BASE}${ev.foto_principal}` : '/hero.jpg'} alt={ev.nombre} />
                  </div>
                  <div className="pro-card-content">
                    <div className="pro-meta-top"><Music size={12} /> Live Set & Drinks</div>
                    <h4>{ev.nombre}</h4>
                    <div className="pro-location">
                      <Calendar size={14} /> <span>{new Date(ev.fecha_inicio).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;