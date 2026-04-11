import { ArrowLeft, Calendar, MapPin, Ticket, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './EventoDetalle.css';

const EventoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    
    const URL_BASE = "http://localhost:3000";
    const DEFAULT_IMAGE = "/hero.jpg"; 

    useEffect(() => {
        api.get(`/eventos/${id}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setEvento(data);
            })
            .catch(err => console.error("Error cargando evento:", err));
    }, [id]);

    const handleReserva = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            await api.post('/reservas/evento', {
                id_evento: id, 
                fecha: evento.fecha_inicio, 
                entradas: cantidad,
                precio_total: evento.precio * cantidad
            });
            alert("¡Reserva confirmada!");
            navigate('/mis-reservas');
        } catch (err) { alert("Error al procesar la reserva"); }
    };

    if (!evento) return <div className="loading-screen-cyber"><div className="loader-text">/ SYNCING_DATA...</div></div>;

    const imgPath = evento.foto_principal ? `${URL_BASE}${evento.foto_principal}` : DEFAULT_IMAGE;

    return (
        <div className="evento-detalle-page-fixed">
            <div className="container container-grid-cyber">
                
                <section className="evento-main-content">
                    <button className="btn-back-minimal" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> VOLVER_A_LA_AGENDA
                    </button>

                    {/* CONTENEDOR CON EFECTO BLUR PARA VER LA IMAGEN COMPLETA */}
                    <div className="hero-frame-blur">
                        {/* Imagen de fondo desenfocada para rellenar huecos */}
                        <div className="blur-bg" style={{ backgroundImage: `url(${imgPath})` }}></div>
                        
                        {/* Imagen principal completa */}
                        <img 
                            src={imgPath} 
                            className="img-main-complete" 
                            alt={evento.nombre}
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                        />
                    </div>

                    <div className="evento-texts-compact">
                        <div className="tag-id-cyan">REF_ID // 0{evento.id_evento}</div>
                        <h1 className="title-huge-compact">{evento.nombre}</h1>
                        
                        <div className="evento-meta-compact">
                            <span><Calendar size={16} className="icon-cyan"/> {new Date(evento.fecha_inicio).toLocaleDateString()}</span>
                            <span><MapPin size={16} className="icon-cyan"/> {evento.ciudad?.toUpperCase()}</span>
                        </div>
                        
                        <div className="evento-desc-card-minimal">
                            <h3><Zap size={14} /> DESCRIPCIÓN_SISTEMA</h3>
                            <p>{evento.descripcion}</p>
                        </div>
                    </div>
                </section>

                <aside className="evento-sidebar">
                    <div className="booking-widget-cyber">
                        <div className="price-header-compact">
                            <span className="amount">{evento.precio}€</span>
                            <span className="label">/ TICKET</span>
                        </div>
                        <div className="input-cyber-group">
                            <label><Ticket size={12} /> ENTRADAS</label>
                            <input type="number" min="1" value={cantidad} onChange={(e)=>setCantidad(Number(e.target.value))} />
                        </div>
                        <div className="total-row-cyber">
                            <span>TOTAL</span>
                            <span className="total-price-neon">{(evento.precio * cantidad).toFixed(2)}€</span>
                        </div>
                        <button className="btn-reserve-neon-boost" onClick={handleReserva}>CONFIRMAR_RESERVA</button>
                        <p className="no-scroll-hint">Trasmisión de datos cifrada</p>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default EventoDetalle;