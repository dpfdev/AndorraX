import 'leaflet/dist/leaflet.css';
import { Award, Calendar, ChevronLeft, MapPin, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../services/api';
import './DetalleCyber.css';

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
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setAct(data);
      } catch (err) { console.error(err); }
    };
    fetchActividad();
  }, [id]);

  useEffect(() => {
    if (act) setTotal(reserva.personas * act.precio);
  }, [reserva.personas, act]);

  if (!act) return <div className="loading-screen-cyber">Cargando Actividad...</div>;

  const position = [act.latitud || 42.5063, act.longitud || 1.5218];

  return (
    <div className="auth-page-snow">
      <div className="container-grid-cyber">
        <section className="main-content-flow">
          <button className="btn-back-minimal" onClick={() => navigate(-1)}><ChevronLeft size={16}/> VOLVER</button>
          <div className="hero-frame-carrusel-compact">
            <CarruselManual imagenes={act.imagenes || [act.foto_principal]} />
          </div>
          <div className="info-body-compact">
            <h1>{act.nombre}</h1>
            <p className="location-tag-cyber"><MapPin size={14}/> {act.ciudad}</p>
            <div className="hotel-desc-card-minimal">
              <h3><Zap size={14}/> DETALLES</h3>
              <p>{act.descripcion}</p>
            </div>
          </div>
        </section>

        <aside className="hotel-sidebar">
          <div className="booking-widget-cyber">
            <div className="price-header-compact">
              <span className="label">PRECIO / PAX</span>
              <div className="total-price-neon">{act.precio}€</div>
            </div>
            <div className="cyber-input-group">
              <label><Calendar size={12}/> FECHA</label>
              <input type="date" value={reserva.fecha} onChange={(e)=>setReserva({...reserva, fecha: e.target.value})} />
            </div>
            <div className="cyber-input-group">
              <label><Users size={12}/> PERSONAS</label>
              <input type="number" min="1" value={reserva.personas} onChange={(e)=>setReserva({...reserva, personas: parseInt(e.target.value)})} />
            </div>
            <div className="total-display-cyber">
              <span className="total-amount-neon">{total.toFixed(2)}€</span>
            </div>
            <button className="btn-reserve-neon-boost" disabled={!reserva.fecha}><Award size={18}/> RESERVAR</button>
          </div>

          <div className="map-sidebar-card">
            <MapContainer center={position} zoom={14} className="map-frame-compact">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}><Popup>{act.nombre}</Popup></Marker>
            </MapContainer>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default ActividadDetalle;