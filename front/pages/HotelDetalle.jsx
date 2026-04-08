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

  useEffect(() => {
    if (reserva.checkIn && reserva.checkOut && hotel) {
      const noches = (new Date(reserva.checkOut) - new Date(reserva.checkIn)) / (1000 * 60 * 60 * 24);
      setTotal(noches > 0 ? noches * hotel.precio_base_noche : 0);
    }
  }, [reserva.checkIn, reserva.checkOut, hotel]);

  const handleReserva = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    if (total <= 0) return alert("Selecciona fechas válidas");

    try {
      await api.post('/reservas', {
        id_hotel: id,
        fecha_inicio: reserva.checkIn,
        fecha_fin: reserva.checkOut,
        huespedes: reserva.personas,
        precio_total: total
      });
      alert("¡Reserva confirmada!");
      navigate('/mis-reservas');
    } catch (err) {
      alert("Error al procesar la reserva");
    }
  };

  if (!hotel) return <div className="container" style={{padding: '50px', textAlign: 'center'}}>Cargando...</div>;

  return (
    <div className="container hotel-detalle-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', marginTop: '40px' }}>
      <section>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 'bold' }}>
          <ArrowLeft size={16}/> VOLVER AL LISTADO
        </button>
        
        {/* Usamos el array de imágenes que ya viene procesado del backend */}
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
          
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CHECK-IN</label>
          <input type="date" value={reserva.checkIn} onChange={(e) => setReserva({...reserva, checkIn: e.target.value})} style={inputStyle} />
          
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginTop: '15px' }}>CHECK-OUT</label>
          <input type="date" value={reserva.checkOut} onChange={(e) => setReserva({...reserva, checkOut: e.target.value})} style={inputStyle} />
          
          <button 
            onClick={handleReserva} 
            disabled={total <= 0}
            style={{ ...btnStyle, background: total > 0 ? '#0f172a' : '#94a3b8', cursor: total > 0 ? 'pointer' : 'not-allowed' }}
          >
            CONFIRMAR RESERVA {total > 0 && `(${total}€)`}
          </button>
        </div>
      </aside>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1' };
const btnStyle = { width: '100%', padding: '15px', marginTop: '20px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' };

export default HotelDetalle;