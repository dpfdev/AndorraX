import { Calendar, ChevronRight, MapPin } from 'lucide-react';
import { useState } from 'react';
import ComprobanteModal from '../components/ComprobanteModal';
import './MisReservas.css';

const MisReservas = () => {
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    // Obtenemos el usuario del localStorage para el comprobante
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};
    const nombreReal = user.nombre || user.name || "Usuario Registrado";

    // Datos extendidos para que se vea toda la info en la tarjeta
    const reservas = [
        {
            id_reserva: "AX-8822",
            nombre_item: "Hotel Sport Hermitage",
            fecha_inicio: "2026-02-12",
            ubicacion: "Soldeu, Andorra",
            precio: "450",
            estado: "confirmada",
            categoria: "Hotel",
            imagen: "https://images.unsplash.com/photo-1551882547-ff43c63be812?w=800"
        },
        {
            id_reserva: "AX-4412",
            nombre_item: "Mushing en Grandvalira",
            fecha_inicio: "2026-02-15",
            ubicacion: "Grau Roig",
            precio: "120",
            estado: "pendiente",
            categoria: "Actividad",
            imagen: "https://images.unsplash.com/photo-1517154593937-057d87b1ec1d?w=800"
        }
    ];

    return (
        <div className="reservas-page">
            <div className="reservas-container">
                <header className="reservas-header">
                    <h1>Mis <span className="blue-x">Reservas</span></h1>
                    <p>Gestiona tus próximas experiencias en Andorra</p>
                </header>
                
                <div className="reservas-grid">
                    {reservas.map((reserva) => (
                        <div className="reserva-card" key={reserva.id_reserva}>
                            {/* IMAGEN */}
                            <div className="reserva-img-container">
                                <img src={reserva.imagen} alt={reserva.nombre_item} />
                                <span className="category-tag">{reserva.categoria}</span>
                            </div>
                            
                            {/* INFO DE LA TARJETA */}
                            <div className="reserva-details">
                                <div className="reserva-main">
                                    <div className={`status-label ${reserva.estado}`}>
                                        {reserva.estado}
                                    </div>
                                    <h3>{reserva.nombre_item}</h3>
                                    
                                    <div className="reserva-icons">
                                        <div className="icon-text">
                                            <Calendar size={16} />
                                            <span>{new Date(reserva.fecha_inicio).toLocaleDateString()}</span>
                                        </div>
                                        <div className="icon-text">
                                            <MapPin size={16} />
                                            <span>{reserva.ubicacion}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="reserva-footer">
                                    <div className="price-info">
                                        <small>Total</small>
                                        <span className="price-amount">{reserva.precio}€</span>
                                    </div>
                                    
                                    <button 
                                        className="btn-ver-detalles"
                                        onClick={() => setReservaSeleccionada({
                                            ...reserva,
                                            nombre_usuario: nombreReal // Inyectamos el nombre para el modal
                                        })}
                                    >
                                        Ver Comprobante <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {reservaSeleccionada && (
                <ComprobanteModal 
                    reserva={reservaSeleccionada} 
                    onClose={() => setReservaSeleccionada(null)} 
                />
            )}
        </div>
    );
};

export default MisReservas;