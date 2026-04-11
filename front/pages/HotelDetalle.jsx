import { ArrowLeft, Calendar, Info, MapPin, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../services/api';
import './HotelDetalle.css';

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
        // Si la API devuelve un array, tomamos el primer elemento
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setHotel(data);
      } catch (err) { 
        console.error("Error cargando hotel:", err); 
      }
    };
    if (id) fetchHotel();
  }, [id]);

  useEffect(() => {
    if (reserva.checkIn && reserva.checkOut && hotel) {
      const inicio = new Date(reserva.checkIn);
      const fin = new Date(reserva.checkOut);
      const diferencia = fin - inicio;
      const noches = diferencia / (1000 * 60 * 60 * 24);
      
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
      alert("Estancia reservada con éxito.");
      navigate('/mis-reservas');
    } catch (err) { 
      alert("Error en el sistema de reservas"); 
    }
  };

  if (!hotel) return (
    <div className="loading-screen-cyber">
      <div className="loader-text">/ ESCANEANDO_ALOJAMIENTOS...</div>
    </div>
  );

  return (
    <div className="hotel-detalle-page-fixed">
      <div className="container hotel-grid-cyber">
        
        {/* COLUMNA IZQUIERDA */}
        <section className="main-info">
          <button className="btn-back-minimal" onClick={() => navigate(-1)}>
            <ArrowLeft size={16}/> VOLVER_AL_MAPA
          </button>
          
          <div className="carrusel-frame">
            <CarruselManual imagenes={hotel.imagenes} />
          </div>

          <div className="hotel-header-compact">
            <div className="title-row">
              <h1>{hotel.nombre}</h1>
              <div className="stars-row">
                {[...Array(Number(hotel.categoria_estrellas) || 0)].map((_, i) => (
                  <Star key={i} fill="var(--accent)" size={16} strokeWidth={0}/>
                ))}
              </div>
            </div>
            
            <p className="location-tag">
              <MapPin size={14} className="icon-cyan"/> {hotel.direccion}, {hotel.ciudad?.toUpperCase()}
            </p>
          </div>

          <div className="info-card-cyber">
            <h3><Info size={14} /> ESPECIFICACIONES_DEL_RECURSO</h3>
            <p>{hotel.descripcion}</p>
          </div>
        </section>

        {/* COLUMNA DERECHA (SIDEBAR) */}
        <aside className="sidebar-booking">
          <div className="booking-widget-cyber">
            <div className="price-tag-big">
              {hotel.precio_base_noche}€ <small>/ NOCHE</small>
            </div>
            
            <div className="cyber-input-group">
              <label><Calendar size={12}/> CHECK-IN</label>
              <input 
                type="date" 
                value={reserva.checkIn} 
                onChange={(e) => setReserva({...reserva, checkIn: e.target.value})} 
              />
            </div>
            
            <div className="cyber-input-group">
              <label><Calendar size={12}/> CHECK-OUT</label>
              <input 
                type="date" 
                value={reserva.checkOut} 
                onChange={(e) => setReserva({...reserva, checkOut: e.target.value})} 
              />
            </div>

            <div className="cyber-input-group">
              <label><Users size={12}/> CAPACIDAD_HUÉSPEDES</label>
              <input 
                type="number" 
                min="1" 
                value={reserva.personas} 
                onChange={(e) => setReserva({...reserva, personas: e.target.value})} 
              />
            </div>
            
            <div className="total-display-cyber">
              <span>TOTAL_ESTANCIA</span>
              <span className="total-amount-neon">{total.toFixed(2)}€</span>
            </div>

            <button 
              className={`btn-reserve-final ${total <= 0 ? 'is-disabled' : ''}`}
              onClick={handleReserva} 
              disabled={total <= 0}
            >
              INICIAR_RESERVA
            </button>

            {total > 0 && (
              <p className="nights-hint">
                Cálculo basado en {Math.round(total / hotel.precio_base_noche)} pernoctaciones
              </p>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default HotelDetalle;