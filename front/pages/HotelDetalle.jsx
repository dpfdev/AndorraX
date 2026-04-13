import 'leaflet/dist/leaflet.css';
import { Award, Calendar, ChevronLeft, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../src/services/api';
import './DetalleCyber.css';

const HotelDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [reserva, setReserva] = useState({ fechaInicio: '', fechaFin: '', personas: 1 });
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await api.get(`/hoteles/${id}`);
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setHotel(data);
            } catch (err) { console.error(err); }
        };
        fetchHotel();
    }, [id]);

    useEffect(() => {
        if (hotel && reserva.fechaInicio && reserva.fechaFin) {
            const noches = Math.max(1, (new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) / (1000 * 60 * 60 * 24));
            setTotal(noches * hotel.precio_base_noche * reserva.personas);
        }
    }, [reserva, hotel]);

    if (!hotel) return <div className="loading-screen-cyber">Cargando Nodo...</div>;

    const position = [hotel.latitud || 42.5063, hotel.longitud || 1.5218];

    return (
        <div className="auth-page-snow">
            <div className="container-grid-cyber">
                <section className="main-content-flow">
                    <button className="btn-back-minimal" onClick={() => navigate(-1)}><ChevronLeft size={16}/> VOLVER</button>
                    <div className="hero-frame-carrusel-compact">
                        <CarruselManual imagenes={hotel.imagenes || [hotel.foto_principal]} />
                    </div>
                    <div className="info-body-compact">
                        <h1>{hotel.nombre}</h1>
                        <p className="location-tag-cyber"><MapPin size={14}/> {hotel.ciudad}</p>
                        <div className="hotel-desc-card-minimal">
                            <p>{hotel.descripcion}</p>
                        </div>
                    </div>
                </section>

                <aside className="hotel-sidebar">
                    <div className="booking-widget-cyber">
                        <div className="price-header-compact">
                            <span className="label">PRECIO / NOCHE</span>
                            <div className="total-price-neon">{hotel.precio_base_noche}€</div>
                        </div>
                        <div className="cyber-input-group">
                            <label><Calendar size={12}/> ENTRADA</label>
                            <input type="date" onChange={(e)=>setReserva({...reserva, fechaInicio: e.target.value})} />
                        </div>
                        <div className="cyber-input-group">
                            <label><Calendar size={12}/> SALIDA</label>
                            <input type="date" onChange={(e)=>setReserva({...reserva, fechaFin: e.target.value})} />
                        </div>
                        <div className="total-display-cyber">
                            <span>TOTAL</span>
                            <span className="total-amount-neon">{total.toFixed(2)}€</span>
                        </div>
                        <button className="btn-reserve-neon-boost"><Award size={18}/> RESERVAR</button>
                    </div>

                    <div className="map-sidebar-card">
                        <MapContainer center={position} zoom={14} className="map-frame-compact">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={position}><Popup>{hotel.nombre}</Popup></Marker>
                        </MapContainer>
                    </div>
                </aside>
            </div>
        </div>
    );
};
export default HotelDetalle;