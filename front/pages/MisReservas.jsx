import axios from 'axios';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ComprobanteModal from "../components/ComprobanteModal";
import './MisReservas.css';

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:3000";

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/reservas/mis-reservas`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReservas(response.data);
            } catch (err) {
                console.error("Error al cargar reservas", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservas();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Cancelar esta reserva?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/reservas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservas(reservas.filter(r => r.id_reserva !== id));
        } catch (err) {
            alert("Error al eliminar");
        }
    };

    const reservasFiltradas = filtro === 'todos' 
        ? reservas 
        : reservas.filter(r => r.tipo_objeto === filtro);

    if (loading) return <div className="reservas-container"><h1>Cargando...</h1></div>;

    return (
        <div className="reservas-container">
            <header className="reservas-header-v2">
                <h1>Mis Reservas</h1>
            </header>

            <div className="filter-nav">
                {['todos', 'hotel', 'actividad', 'evento'].map(t => (
                    <button 
                        key={t}
                        className={`filter-tab ${filtro === t ? 'active' : ''}`}
                        onClick={() => setFiltro(t)}
                    >
                        {t === 'todos' ? 'Todas' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
                    </button>
                ))}
            </div>

            <div className="reservas-grid-modern">
                {reservasFiltradas.map((reserva) => (
                    <div key={reserva.id_reserva} className="reserva-card-modern">
                        <div className="reserva-image-wrapper">
                            <img 
                                src={reserva.imagen_url ? `${API_URL}${reserva.imagen_url}` : "https://via.placeholder.com/400x300"} 
                                alt={reserva.nombre_objeto} 
                            />
                            <div className="price-tag">{reserva.precio}€</div>
                        </div>

                        <div className="reserva-content">
                            <h3>{reserva.nombre_objeto || reserva.tipo_objeto.toUpperCase()}</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                Fecha: {new Date(reserva.fecha_inicio).toLocaleDateString()}
                            </p>
                            
                            <div className="reserva-footer">
                                <button className="btn-secondary" onClick={() => setReservaSeleccionada(reserva)}>
                                    <ExternalLink size={16} /> Ver Ticket
                                </button>
                                <button className="btn-danger-outline" onClick={() => handleEliminar(reserva.id_reserva)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE TICKET */}
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