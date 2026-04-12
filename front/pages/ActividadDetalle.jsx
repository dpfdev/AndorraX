import { Calendar, ChevronLeft, MapPin, Star, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../services/api';
// Reutilizamos los estilos base de HotelDetalle para consistencia total, 
// o puedes usar ActividadDetalle.css si tiene las mismas clases.
import './HotelDetalle.css';

const ActividadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [act, setAct] = useState(null);
  const [reserva, setReserva] = useState({ fecha: '', personas: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const res = await api.get(`/actividades/${id}`);
        // Manejo de respuesta tanto si es array como objeto
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setAct(data);
      } catch (err) { 
        console.error("Error cargando actividad:", err); 
      }
    };
    if (id) fetchActividad();
  }, [id]);

  // Cálculo de total automático basado en personas
  useEffect(() => {
    if (act) {
      setTotal(reserva.personas * act.precio);
    }
  }, [reserva.personas, act]);

  const handleReserva = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    if (!reserva.fecha) return alert("Selecciona una fecha para la misión");

    try {
      await api.post('/reservas/actividad', {
        id_actividad: id,
        fecha: reserva.fecha,
        personas: reserva.personas,
        precio_total: total
      });
      alert("Sincronización exitosa. Misión confirmada.");
      navigate('/mis-reservas');
    } catch (err) { 
      alert("Error en el enlace de datos."); 
    }
  };

  if (!act) return (
    <div className="loading-screen-cyber">
      <div className="loader-orbit"></div>
      <span>/ BOOTING_SYSTEM...</span>
    </div>
  );

  return (
    <div className="hotel-detalle-page-fixed"> {/* Usamos la misma clase que HotelDetalle */}
      <div className="container-grid-cyber">
        
        {/* COLUMNA IZQUIERDA: MEDIA + INFO */}
        <section className="main-content-flow">
          <button className="btn-back-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={16}/> VOLVER_AL_PANEL
          </button>
          
          {/* Carrusel adaptado a Actividad */}
          <div className="hero-frame-carrusel-mini">
            <CarruselManual imagenes={act.imagenes || [act.foto_principal]} />
          </div>

          <div className="info-body-compact">
            <div className="header-flex-hotel">
               <span className="tag-id-cyan">ACTIVITY_REF_ID // 0{act.id_actividad}</span>
               <div className="stars-row">
                {/* Opcional: Si las actividades tienen dificultad o rating */}
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill={i < 4 ? "var(--accent)" : "transparent"} size={14} strokeWidth={1} color="var(--accent)"/>
                ))}
              </div>
            </div>
            
            <h1 className="title-huge-compact">{act.nombre}</h1>
            
            <p className="location-tag-cyber">
              <MapPin size={14} className="icon-cyan"/> {act.ciudad?.toUpperCase() || 'ANDORRA_CORE'}
            </p>

            <div className="hotel-desc-card-minimal">
              <h3><Zap size={14} /> ESPECIFICACIONES_TÉCNICAS</h3>
              <p>{act.descripcion}</p>
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA: SIDEBAR DE RESERVA */}
        <aside className="hotel-sidebar">
          <div className="sticky-sidebar-wrapper">
            <div className="booking-widget-cyber">
              <div className="price-header-compact">
                <span className="label">COSTE_POR_PAX</span>
                <div className="total-price-neon">{act.precio}€ <small>/ UNIDAD</small></div>
              </div>
              
              <div className="cyber-input-group">
                <label><Calendar size={12}/> FECHA_MISION</label>
                <input 
                  type="date" 
                  value={reserva.fecha} 
                  onChange={(e) => setReserva({...reserva, fecha: e.target.value})} 
                />
              </div>

              <div className="cyber-input-group">
                <label><Users size={12}/> UNIDADES_PAX</label>
                <input 
                  type="number" 
                  min="1" 
                  value={reserva.personas} 
                  onChange={(e) => setReserva({...reserva, personas: e.target.value})} 
                />
              </div>
              
              <div className="total-display-cyber">
                <span>TOTAL_ESTIMADO</span>
                <span className="total-amount-neon">{total.toFixed(2)}€</span>
              </div>

              <button 
                className={`btn-reserve-neon-boost ${!reserva.fecha ? 'is-disabled' : ''}`}
                onClick={handleReserva} 
                disabled={!reserva.fecha}
              >
                {reserva.fecha ? 'CONFIRMAR_MISION' : 'ESPERANDO_FECHA'}
              </button>

              <p className="nights-hint">
                STATUS: Enlace listo para sincronización inmediata.
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default ActividadDetalle;