import 'leaflet/dist/leaflet.css';
import { Award, Calendar, ChevronLeft, Clock, MapPin, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../services/api';
import './DetalleCyber.css';

const EventoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const res = await api.get(`/eventos/${id}`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setEvento(data);
      } catch (err) { console.error("Error cargando evento", err); }
    };
    fetchEvento();
  }, [id]);

  useEffect(() => {
    if (evento) setTotal(cantidad * evento.precio_entrada);
  }, [cantidad, evento]);

  if (!evento) return <div className="loading-screen-cyber"><span>Sincronizando Nodo Evento...</span></div>;

  const position = [evento.latitud || 42.5063, evento.longitud || 1.5218];

  return (
    <div className="auth-page-snow"> {/* Añadir 'light-mode' aquí para probar el modo claro */}
      <div className="container-grid-cyber">
        
        <section className="main-content-flow">
          <button className="btn-back-minimal" onClick={() => navigate(-1)}><ChevronLeft size={16}/> VOLVER</button>
          
          <div className="hero-frame-carrusel-compact">
            <CarruselManual imagenes={evento.imagenes || [evento.foto_principal]} />
          </div>

          <div className="info-body-compact">
            <h1>{evento.nombre}</h1>
            <div style={{display: 'flex', gap: '20px'}}>
                <p className="location-tag-cyber"><MapPin size={14}/> {evento.lugar}</p>
                <p className="location-tag-cyber"><Clock size={14}/> {evento.hora || "20:00"} HRS</p>
                <p className="location-tag-cyber"><Calendar size={14}/> {new Date(evento.fecha).toLocaleDateString()}</p>
            </div>
            <div className="hotel-desc-card-minimal">
              <h3><Zap size={14}/> DESCRIPCIÓN DEL EVENTO</h3>
              <p>{evento.descripcion}</p>
            </div>
          </div>
        </section>

        <aside className="hotel-sidebar">
          <div className="booking-widget-cyber">
            <div className="price-header-compact">
              <span className="label">TICKET / ENTRADA</span>
              <div className="total-price-neon">{evento.precio_entrada}€</div>
            </div>
            
            <div className="cyber-input-group">
              <label><Users size={12}/> CANTIDAD</label>
              <input 
                type="number" 
                min="1" 
                value={cantidad} 
                onChange={(e) => setCantidad(parseInt(e.target.value))} 
              />
            </div>

            <div className="total-display-cyber">
              <span>TOTAL</span>
              <span className="total-amount-neon">{total.toFixed(2)}€</span>
            </div>

            <button className="btn-reserve-neon-boost">
              <Award size={18} />
              <span>ADQUIRIR ENTRADAS</span>
            </button>
          </div>

          <div className="map-sidebar-card">
            <div className="map-frame-compact">
              <MapContainer center={position} zoom={15} style={{height: "100%", width: "100%"}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}><Popup>{evento.nombre}</Popup></Marker>
              </MapContainer>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default EventoDetalle;