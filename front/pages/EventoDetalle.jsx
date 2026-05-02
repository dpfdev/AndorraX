import 'leaflet/dist/leaflet.css';
import { Award, Calendar, ChevronLeft, Clock, Info, Loader2, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import CarruselManual from '../components/CarruselManual';
import api from '../src/services/api';
import './DetalleCyber.css';

const EventoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null); // Usamos 'item' para consistencia con los otros detalles
    const [cantidad, setCantidad] = useState(1);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const res = await api.get(`/eventos/${id}`);
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setItem(data);
            } catch (err) { console.error(err); }
        };
        fetchEvento();
    }, [id]);

    if (!item) return (
        <div className="loading-container-pro">
            <Loader2 className="spinner-main animate-spin" />
            <p>Sincronizando con el nodo de eventos...</p>
        </div>
    );

    const precioUnitario = Number(item.precio || 0);
    const precioTotal = cantidad * precioUnitario;
    
    // Posición para el mapa (Leaflet)
    const position = [item.latitud || 42.5063, item.longitud || 1.5218];

    const handleReserva = async () => {
        setEnviando(true);
        try {
            await api.post('/reservas/evento', {
                id_objeto: id,
                fecha_inicio: item.fecha_inicio,
                precio: precioTotal
            });
            alert("¡ENTRADAS ADQUIRIDAS!");
            navigate('/mis-reservas');
        } catch (err) {
            alert("Error al procesar la compra");
        } finally { setEnviando(false); }
    };

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
                        <span className="tag-id-cyan">EVENTO_REF: {id.slice(-6).toUpperCase()}</span>
                        <h1 className="title-huge-compact">{item.nombre}</h1>
                        
                        <div className="location-tag-cyber">
                            <MapPin size={20} /> {item.lugar || item.ciudad}
                            <span style={{margin: '0 10px'}}>|</span>
                            <Calendar size={18} /> {new Date(item.fecha_inicio).toLocaleDateString()}
                            <span style={{margin: '0 10px'}}>|</span>
                            <Clock size={18} /> {item.hora || "20:00"}
                        </div>
                        
                        <div className="desc-card-unified">
                            <h3><Info size={16} /> DESCRIPCIÓN DEL EVENTO</h3>
                            <p>{item.descripcion}</p>
                        </div>

                        {/* SECCIÓN DEL MAPA INTERACTIVO (Igual que Hoteles/Actividades) */}
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

                {/* SIDEBAR DERECHO: COMPRA */}
                <aside className="hotel-sidebar">
                    <div className="booking-widget-cyber">
                        <div className="price-header-pro">
                            <small>PRECIO POR TICKET</small>
                            <div className="price-value">{precioUnitario.toFixed(2)}€</div>
                        </div>

                        <div className="booking-form-pro">
                            <div className="cyber-input-group">
                                <label><Users size={14}/> NÚMERO DE ENTRADAS</label>
                                <div className="quantity-selector-cyber">
                                    <button className="qty-btn" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                                    <input className="qty-input" type="number" value={cantidad} readOnly />
                                    <button className="qty-btn" onClick={() => setCantidad(cantidad + 1)}>+</button>
                                </div>
                            </div>

                            <div className="total-display-cyber">
                                <span>TOTAL A PAGAR</span>
                                <span className="total-amount-pro">{precioTotal.toFixed(2)}€</span>
                            </div>

                            <button 
                                className="btn-reserve-pro" 
                                onClick={handleReserva} 
                                disabled={enviando}
                            >
                                {enviando ? <Loader2 className="animate-spin" /> : <><Award size={18} style={{marginRight: '8px'}}/> COMPRAR TICKETS</>}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EventoDetalle;