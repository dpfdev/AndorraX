import 'leaflet/dist/leaflet.css';
import { Award, Calendar, ChevronLeft, Loader2, MapPin, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../src/services/api';
import './DetalleCyber.css';

const ActividadDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null); // Usamos 'item' para consistencia
    const [reserva, setReserva] = useState({ fecha: '', personas: 1 });
    const [total, setTotal] = useState(0);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const fetchActividad = async () => {
            try {
                const res = await api.get(`/actividades/${id}`);
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setItem(data);
            } catch (err) { console.error(err); }
        };
        fetchActividad();
    }, [id]);

    useEffect(() => {
        if (item) setTotal(reserva.personas * item.precio);
    }, [reserva.personas, item]);

    const handleReserva = async () => {
        if (!reserva.fecha) return alert("Selecciona una fecha");
        setEnviando(true);
        try {
            await api.post('/reservas/actividad', {
                id_objeto: id,
                fecha_inicio: reserva.fecha,
                precio: total 
            });
            alert("¡MISIÓN CONFIRMADA!");
            navigate('/mis-reservas');
        } catch (err) {
            alert(err.response?.data?.error || "Error al reservar");
        } finally {
            setEnviando(false);
        }
    };

    if (!item) return (
        <div className="loading-container-pro">
            <Loader2 className="spinner-main animate-spin" />
            <p>Sincronizando coordenadas...</p>
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
                            <h3><Zap size={16}/> ESPECIFICACIONES DE LA MISIÓN</h3>
                            <p>{item.descripcion}</p>
                        </div>

                        {/* SECCIÓN DEL MAPA (Mismo estilo que Hoteles) */}
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
                            <small>PRECIO POR AGENTE</small>
                            <div className="price-value">{item.precio}€</div>
                        </div>

                        <div className="booking-form-pro">
                            <div className="cyber-input-group">
                                <label><Calendar size={14}/> FECHA_MISIÓN</label>
                                <input 
                                    type="date" 
                                    value={reserva.fecha} 
                                    onChange={(e)=>setReserva({...reserva, fecha: e.target.value})} 
                                />
                            </div>

                            <div className="cyber-input-group">
                                <label><Users size={14}/> NÚMERO DE AGENTES</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={reserva.personas} 
                                    onChange={(e)=>setReserva({...reserva, personas: parseInt(e.target.value) || 1})} 
                                />
                            </div>

                            <div className="total-display-cyber">
                                <span>TOTAL DE LA OPERACIÓN</span>
                                <span className="total-amount-pro">{total.toFixed(2)}€</span>
                            </div>

                            <button 
                                className="btn-reserve-pro" 
                                disabled={!reserva.fecha || enviando} 
                                onClick={handleReserva}
                            >
                                {enviando ? <Loader2 className="animate-spin" /> : <><Award size={18} style={{marginRight: '8px'}}/> CONFIRMAR_MISION</>}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ActividadDetalle;