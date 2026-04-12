import { Calendar, ChevronLeft, Info, MapPin, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../services/api';
// Usamos el CSS de Actividad para garantizar la paridad visual
import './ActividadDetalle.css';

const HotelDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reserva, setReserva] = useState({ checkIn: '', checkOut: '', personas: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hoteles/${id}`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setHotel(data);
      } catch (err) { 
        console.error("Error cargando hotel:", err); 
      }
    };
    if (id) fetchHotel();
  }, [id]);

  // Cálculo de total automático por noches
  useEffect(() => {
    if (reserva.checkIn && reserva.checkOut && hotel) {
      const inicio = new Date(reserva.checkIn);
      const fin = new Date(reserva.checkOut);
      const noches = (fin - inicio) / (1000 * 60 * 60 * 24);
      setTotal(noches > 0 ? noches * hotel.precio_base_noche : 0);
    }
  }, [reserva.checkIn, reserva.checkOut, hotel]);

  const handleReserva = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    if (total <= 0) return alert("Selecciona un rango de fechas válido");

    try {
      await api.post('/reservas/hotel', {
        id_hotel: id,
        fecha_entrada: reserva.checkIn,
        fecha_salida: reserva.checkOut,
        personas: reserva.personas,
        precio_total: total
      });
      alert("Sincronización de estancia exitosa. Recurso asignado.");
      navigate('/mis-reservas');
    } catch (err) { 
      alert("Error en el enlace de datos del sistema de reservas"); 
    }
  };

  if (!hotel) return (
    <div className="loading-wrapper-cyber">
      <div className="loader-orbit"></div>
      <span>/ ESCANEANDO_ALOJAMIENTOS...</span>
    </div>
  );

  return (
    <div className="detail-page-cyber">
      <div className="container-detail-cyber">
        
        {/* COLUMNA IZQUIERDA: VISUAL Y DATOS */}
        <section className="detail-main-content">
          <button className="btn-back-cyber" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} /> VOLVER_AL_PANEL
          </button>

          {/* Carrusel adaptativo integrado */}
          <div className="hero-frame-adaptive">
            <CarruselManual imagenes={hotel.imagenes || [hotel.foto_principal]} />
            <div className="frame-glow-bottom"></div>
          </div>

          <div className="info-content-cyber">
            <div className="header-flex-info">
              <span className="tag-id-cyan">RECURSO_UNIT_ID // 0{hotel.id_hotel}</span>
              <div className="stars-row">
                {[...Array(Number(hotel.categoria_estrellas) || 0)].map((_, i) => (
                  <Star key={i} fill="var(--accent)" size={14} strokeWidth={0}/>
                ))}
              </div>
            </div>
            
            <h1 className="title-huge-cyber">{hotel.nombre}</h1>
            <p className="loc-text-cyber">
              <MapPin size={18} className="icon-cyan"/> {hotel.direccion?.toUpperCase()}, {hotel.ciudad?.toUpperCase()}
            </p>
            
            <div className="desc-box-cyber">
              <div className="desc-header-cyber"><Info size={18} /> ESPECIFICACIONES_DEL_RECURSO</div>
              <p>{hotel.descripcion}</p>
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA: PANEL DE CONTROL SIDEBAR */}
        <aside className="detail-sidebar-cyber">
          <div className="booking-card-cyber">
            <div className="price-header-cyber">
              {hotel.precio_base_noche}€ <small>/ NOCHE</small>
            </div>
            
            <div className="form-cyber">
              <div className="input-cyber-group">
                <label><Calendar size={14}/> CHECK-IN</label>
                <input 
                  type="date" 
                  value={reserva.checkIn} 
                  onChange={(e) => setReserva({...reserva, checkIn: e.target.value})} 
                />
              </div>

              <div className="input-cyber-group">
                <label><Calendar size={14}/> CHECK-OUT</label>
                <input 
                  type="date" 
                  value={reserva.checkOut} 
                  onChange={(e) => setReserva({...reserva, checkOut: e.target.value})} 
                />
              </div>

              <div className="input-cyber-group">
                <label><Users size={14}/> HUÉSPEDES</label>
                <input 
                  type="number" 
                  min="1" 
                  value={reserva.personas} 
                  onChange={(e) => setReserva({...reserva, personas: e.target.value})} 
                />
              </div>
              
              <div className="total-row-cyber">
                <span>TOTAL_ESTANCIA</span>
                <span className="total-price-cyan">{total.toFixed(2)}€</span>
              </div>

              <button 
                className={`btn-submit-cyber ${total <= 0 ? 'locked' : ''}`}
                onClick={handleReserva} 
                disabled={total <= 0}
              >
                {total > 0 ? 'INICIAR_RESERVA' : 'ESPERANDO_FECHAS'}
              </button>

              {total > 0 && (
                <p className="status-log-text">
                  LOG: {Math.round(total / hotel.precio_base_noche)} pernoctaciones detectadas.
                </p>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default HotelDetalle;