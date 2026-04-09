import { ArrowLeft, MapPin, Star } from 'lucide-react';
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

  // 1. Cargar datos del hotel
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hoteles/${id}`);
        setHotel(res.data);
      } catch (err) { 
        console.error("Error cargando hotel:", err); 
      }
    };
    fetchHotel();
  }, [id]);

  // 2. Calcular precio total automáticamente
  useEffect(() => {
    if (reserva.checkIn && reserva.checkOut && hotel) {
      const noches = (new Date(reserva.checkOut) - new Date(reserva.checkIn)) / (1000 * 60 * 60 * 24);
      setTotal(noches > 0 ? noches * hotel.precio_base_noche : 0);
    }
  }, [reserva.checkIn, reserva.checkOut, hotel]);

  // 3. Función de Reserva (CORREGIDA)
  const handleReserva = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión para reservar");
        return navigate('/login');
    }
    
    if (total <= 0) return alert("Selecciona fechas válidas (mínimo 1 noche)");

    try {
      // LLAMADA CORREGIDA: /reservas/hotel
      await api.post('/reservas/hotel', {
        id_hotel: id,                   // ID del hotel desde la URL
        fecha_entrada: reserva.checkIn, // Coincide con el Backend
        fecha_salida: reserva.checkOut, // Coincide con el Backend
        personas: reserva.personas,
        precio_total: total             // Coincide con el Backend
      });

      alert("¡Reserva confirmada!");
      navigate('/mis-reservas');
    } catch (err) {
      console.error("Error en reserva:", err.response?.data || err.message);
      alert("Error al procesar la reserva: " + (err.response?.data?.error || "Inténtalo de nuevo"));
    }
  };

  if (!hotel) return <div className="container" style={{padding: '50px', textAlign: 'center'}}>Cargando...</div>;

  return (
    <div className="container hotel-detalle-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', marginTop: '40px' }}>
      <section>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 'bold' }}>
          <ArrowLeft size={16}/> VOLVER AL LISTADO
        </button>
        
        {/* Carrusel de imágenes */}
        <CarruselManual imagenes={hotel.imagenes} />

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{hotel.nombre}</h1>
          <div style={{ display: 'flex', color: '#ffcc00', marginLeft: '20px' }}>
            {[...Array(Number(hotel.categoria_estrellas) || 0)].map((_, i) => (
              <Star key={i} fill="#ffcc00" size={20} strokeWidth={0}/>
            ))}
          </div>
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginTop: '10px' }}>
          <MapPin size={20} color="#38bdf8"/> {hotel.direccion}, {hotel.ciudad}
        </p>

        <div style={{ marginTop: '40px', padding: '30px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>Sobre el hotel</h3>
          <p style={{ lineHeight: '1.7', color: '#475569' }}>{hotel.descripcion}</p>
        </div>
      </section>

      <aside>
        <div style={{ position: 'sticky', top: '100px', background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{hotel.precio_base_noche}€ / noche</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CHECK-IN</label>
            <input type="date" value={reserva.checkIn} onChange={(e) => setReserva({...reserva, checkIn: e.target.value})} style={inputStyle} />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CHECK-OUT</label>
            <input type="date" value={reserva.checkOut} onChange={(e) => setReserva({...reserva, checkOut: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>HUÉSPEDES</label>
            <input type="number" min="1" value={reserva.personas} onChange={(e) => setReserva({...reserva, personas: e.target.value})} style={inputStyle} />
          </div>
          
          <button 
            onClick={handleReserva} 
            disabled={total <= 0}
            style={{ 
                ...btnStyle, 
                background: total > 0 ? '#0f172a' : '#94a3b8', 
                cursor: total > 0 ? 'pointer' : 'not-allowed' 
            }}
          >
            CONFIRMAR RESERVA {total > 0 && `(${total}€)`}
          </button>

          {total > 0 && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '15px' }}>
                Precio total por {Math.round(total / hotel.precio_base_noche)} noches
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

// Estilos rápidos
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '15px', marginTop: '20px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: 'background 0.3s' };

export default HotelDetalle;