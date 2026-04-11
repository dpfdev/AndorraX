import { motion } from 'framer-motion';
import { Activity, ArrowRight, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './HotelesListado.css'; // Usamos el mismo CSS para mantener la coherencia total

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const URL_BASE = "http://localhost:3000"; 
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"; 

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const response = await api.get('/actividades');
                setActividades(response.data);
            } catch (error) {
                console.error("Error cargando actividades:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActividades();
    }, []);

    if (isLoading) {
        return (
            <div className="loading-wrapper">
                <div className="loading-tech-text">SINCRONIZANDO SECTOR ANDORRA...</div>
            </div>
        );
    }

    return (
        <div className="hoteles-page-container"> {/* Mantengo las clases de CSS para que el diseño sea idéntico */}
            <header className="section-header-modern">
                <div className="header-meta">/ ANDORRAX // MISSION SELECTION</div>
                <h2 className="glitch-title-small">Aventura <span className="x-neon">Extrema</span></h2>
            </header>

            <main className="hoteles-grid-layout">
                {actividades.map((act, index) => (
                    <motion.div 
                        key={act.id_actividad} 
                        className="cyber-hotel-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                        <div className="card-media-wrapper">
                            <img 
                                src={act.foto_principal ? `${URL_BASE}${act.foto_principal}` : DEFAULT_IMAGE} 
                                alt={act.nombre} 
                                className="hotel-main-image"
                                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                            />
                            <div className="card-glow-edge"></div>
                            <div className="price-tag-neon">{act.precio}€</div>
                            <div className="rating-tag-glass">
                                <Clock size={12} /> {act.duracion || '2h'}
                            </div>
                        </div>

                        <div className="card-body-modern">
                            <div className="category-tag">
                                <Activity size={10} /> FIELD MISSION // ACTIVE
                            </div>
                            <h3 className="hotel-title-text">{act.nombre}</h3>
                            <div className="card-info-data">
                                <p className="data-item-mono">
                                    <MapPin size={14} className="icon-accent" /> 
                                    {act.ciudad?.toUpperCase() || 'ANDORRA'}
                                </p>
                            </div>
                            <div className="amenities-row">
                                <span className="amenity-pill">GUIDE</span>
                                <span className="amenity-pill">GEAR</span>
                                <span className="amenity-pill">PRO</span>
                            </div>
                        </div>

                        <div className="card-footer-action">
                            <Link to={`/actividades/${act.id_actividad}`} className="btn-explore-modern">
                                VER DETALLES <ArrowRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </main>
        </div>
    );
};

export default Actividades;