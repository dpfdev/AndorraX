import { Calendar, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        api.get('/reservas/mis-reservas')
            .then(res => setReservas(res.data))
            .catch(err => console.error("Error al cargar historial:", err));
    }, []);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '30px' }}>Mis Reservas en Andorra</h1>
            <div style={{ display: 'grid', gap: '15px' }}>
                {reservas.map(res => (
                    <div key={res.id_reserva} style={{ 
                        background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b' }}>
                                {res.tipo_objeto}
                            </span>
                            <h3 style={{ margin: '5px 0' }}>{res.nombre_item || 'Cargando nombre...'}</h3>
                            <div style={{ display: 'flex', gap: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={14}/> {new Date(res.fecha_inicio).toLocaleDateString()}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CreditCard size={14}/> {res.precio}€
                                </span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{res.estado}</span>
                            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>ID #{res.id_reserva}</p>
                        </div>
                    </div>
                ))}
                {reservas.length === 0 && <p>No tienes reservas todavía.</p>}
            </div>
        </div>
    );
};

export default MisReservas;