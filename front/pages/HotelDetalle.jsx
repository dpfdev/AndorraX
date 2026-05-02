import 'leaflet/dist/leaflet.css';
import { Award, Calendar, ChevronLeft, Loader2, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../src/services/api';
import './DetalleCyber.css';

const HotelDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null); // Usamos 'item' como nombre genérico
    const [reserva, setReserva] = useState({ fechaInicio: '', fechaFin: '', personas: 1 });
    const [total, setTotal] = useState(0);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cambia esta URL según el componente: /hoteles, /actividades o /eventos
                const res = await api.get(`/hoteles/${id}`);
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setItem(data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (item && reserva.fechaInicio && reserva.fechaFin) {
            // Lógica de precio: algunos tienen 'precio_base_noche' y otros 'precio'
            const precioRef = item.precio_base_noche || item.precio || 0;
            const noches = Math.max(1, (new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) / (1000 * 60 * 60 * 24));
            setTotal(noches * precioRef * reserva.personas);
        }
    }, [reserva, item]);

    const handleReserva = async () => {
        if (!reserva.fechaInicio || !reserva.fechaFin) return alert("Selecciona fechas");
        setEnviando(true);
        try {
            await api.post('/reservas/hotel', {
                id_objeto: id,
                fecha_inicio: reserva.fechaInicio,
                fecha_fin: reserva.fechaFin,
                precio: total
            });
            alert("¡Reserva confirmada!");
            navigate('/mis-reservas');
        } catch (err) {
            alert(err.response?.data?.error || "Error al reservar");
        } finally { setEnviando(false); }
    };

    if (!item) return (
        <div className="loading-container-pro">
            <Loader2 className="spinner-main animate-spin" />
            <p>Sincronizando con el nodo...</p>
        </div>
    );

    const position = [item.latitud || 42.5063, item.longitud || 1.5218];

    return (
        <div className="hotel-detalle-page-fixed">
            <div className="container-grid-cyber">
                
                {/* COLUMNA IZQUIERDA: CONTENIDO */}
                <main className="main-content-flow">
                    <button className="btn-back-minimal" onClick={() => navigate(-1)}>
                        <ChevronLeft size={18}/> VOLVER
                    </button>

                    <div className="hero-frame-carrusel-mini">
                        <CarruselManual imagenes={item.imagenes || [item.foto_principal]} />
                    </div>

                    <div className="info-body-compact">
                        <span className="tag-id-cyan">REF_ID: {id.slice(-6).toUpperCase()}</span>
                        <h1 className="title-huge-compact">{item.nombre}</h1>
                        
                        <p className="location-tag-cyber">
                            <MapPin size={20} /> {item.ciudad}
                        </p>
                        
                        <div className="desc-card-unified">
                            <h3><Award size={16} /> ESPECIFICACIONES</h3>
                            <p>{item.descripcion}</p>
                        </div>

                        {/* SECCIÓN DEL MAPA */}
                        <div className="map-frame-pro">
                            <MapContainer 
                                center={position} 
                                zoom={15} 
                                scrollWheelZoom={false} 
                                className="leaflet-container"
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={position}>
                                    <Popup>{item.nombre}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </main>

                {/* SIDEBAR DERECHO: RESERVA */}
                <aside className="hotel-sidebar">
                    <div className="booking-widget-cyber">
                        <div className="price-header-pro">
                            <small>PRECIO BASE</small>
                            <div className="price-value">
                                {item.precio_base_noche || item.precio}€
                            </div>
                        </div>

                        <div className="booking-form-pro">
                            <div className="cyber-input-group">
                                <label><Calendar size={14}/> FECHA INICIO</label>
                                <input type="date" onChange={(e)=>setReserva({...reserva, fechaInicio: e.target.value})} />
                            </div>
                            <div className="cyber-input-group">
                                <label><Calendar size={14}/> FECHA FIN</label>
                                <input type="date" onChange={(e)=>setReserva({...reserva, fechaFin: e.target.value})} />
                            </div>

                            <div className="total-display-cyber">
                                <span>TOTAL ESTIMADO</span>
                                <span className="total-amount-pro">{total.toFixed(2)}€</span>
                            </div>

                            <button className="btn-reserve-pro" onClick={handleReserva} disabled={enviando}>
                                {enviando ? <Loader2 className="animate-spin" /> : "CONFIRMAR RESERVA"}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HotelDetalle;