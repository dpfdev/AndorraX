import { ArrowLeft, ArrowRight, Calendar, MapPin, Music } from 'lucide-react'; // <-- Importado ArrowLeft
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Importado useNavigate
import api from '../src/services/api';
import './Eventos.css'; // Asegúrate de que use el mismo layout que Actividades.css

const Eventos = () => {
    const [eventos, setEventos] = useState([]);
    const URL_BASE = "http://localhost:3000";
    const navigate = useNavigate(); // <-- Inicializado el hook de navegación

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const res = await api.get('/eventos');
                setEventos(res.data);
            } catch (err) {
                console.error("Error:", err);
            }
        };
        fetchEventos();
    }, []);

    return (
        <div className="actividades-page-cyber"> {/* Usamos la clase de actividades para el fondo */}
            <header className="eventos-header-cyber">
                <div className="header-overlay"></div>
                <div className="container header-content">
                    
                    {/* BOTÓN VOLVER ATRÁS (ESTILO CYBER) */}
                    <button 
                        className="btn-back-cyber" 
                        type="button" 
                        onClick={() => navigate('/')} 
                        style={{ marginBottom: '15px', position: 'relative', zIndex: 3 }} 
                    >
                        <ArrowLeft size={16} /> Volver
                    </button>

                    <div className="header-meta">/ AGENDA // 2026</div>
                    <h1 className="glitch-title">Events & <span className="x-neon">Experience</span></h1>
                </div>
            </header>

            <main className="container">
                <div className="actividades-grid-cyber"> {/* Clase del grid de actividades */}
                    {eventos.map((ev) => (
                        <Link to={`/eventos/${ev.id_evento}`} key={ev.id_evento} className="actividad-card-cyber">
                            <div className="actividad-media">
                                <img 
                                    src={ev.foto_principal ? `${URL_BASE}${ev.foto_principal}` : "/hero.jpg"} 
                                    alt={ev.nombre} 
                                    className="actividad-img"
                                />
                                <div className="price-badge-cyber">{ev.precio}€</div>
                            </div>
                            
                            <div className="actividad-info">
                                <div className="category-tag-cyber">
                                    <Music size={14} /> <span>EVENT_DATA // 0{ev.id_evento}</span>
                                </div>
                                <h3>{ev.nombre}</h3>
                                
                                <div className="actividad-meta">
                                    <span><MapPin size={14} /> {ev.lugar}</span>
                                    <span><Calendar size={14} /> {new Date(ev.fecha_inicio).toLocaleDateString()}</span>
                                </div>

                                <div className="actividad-action">
                                    <span>SINC_DETALLES</span>
                                    <ArrowRight size={18} />
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