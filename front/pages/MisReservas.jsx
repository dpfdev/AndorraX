import { Calendar, Clock, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import ComprobanteModal from '../components/ComprobanteModal';
import api from '../services/api';
import './MisReservas.css';

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const res = await api.get('/reservas/mis-reservas');
                setReservas(res.data);
            } catch (err) {
                console.error("Error al cargar reservas:", err);
            }
        };
        fetchReservas();
    }, []);

    return (
        <div className="reservas-page">
            <h1 className="reservas-title">Mis Reservas</h1>
            <div className="reservas-grid">
                {reservas.map((res) => (
                    <div key={res.id_reserva} className="reserva-card">
                        <div className="reserva-header">
                            <span className={`badge ${res.tipo_objeto}`}>{res.tipo_objeto}</span>
                            <span className="ref"># {res.id_reserva}</span>
                        </div>
                        <div className="reserva-body">
                            <h3>{res.nombre_item}</h3>
                            <p><Calendar size={14} /> {new Date(res.fecha_inicio).toLocaleDateString()}</p>
                            {res.fecha_fin && <p><Clock size={14} /> Check-out: {new Date(res.fecha_fin).toLocaleDateString()}</p>}
                        </div>
                        <div className="reserva-footer">
                            <span className="precio">{res.precio}€</span>
                            <button className="btn-ticket" onClick={() => setReservaSeleccionada(res)}>
                                <FileText size={16} /> Comprobante
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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