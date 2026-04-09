import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EventoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        api.get(`/eventos/${id}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setEvento(data);
            })
            .catch(err => console.error("Error:", err));
    }, [id]);

    const handleReserva = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            await api.post('/reservas/evento', {
                id_evento: id, fecha: evento.fecha_inicio, entradas: cantidad,
                precio_total: evento.precio * cantidad
            });
            alert("Reserva realizada");
            navigate('/mis-reservas');
        } catch (err) { alert("Error"); }
    };

    if (!evento) return <div style={{textAlign:'center', padding:'50px'}}>Cargando...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
            <section>
                <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                    <ArrowLeft size={18} /> VOLVER
                </button>
                <div style={{ width: '100%', height: '450px', backgroundColor: '#f1f5f9', borderRadius: '20px', overflow: 'hidden' }}>
                    <img 
                        src={evento.foto_principal ? `http://localhost:3000${evento.foto_principal}` : 'https://images.unsplash.com/photo-1514525253361-bee8718a300a'} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        alt={evento.nombre}
                    />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginTop: '20px' }}>{evento.nombre}</h1>
                <div style={{ display:'flex', gap:'20px', color:'#64748b', margin:'10px 0'}}>
                    <span><Calendar size={18}/> {new Date(evento.fecha_inicio).toLocaleDateString()}</span>
                    <span><MapPin size={18}/> {evento.ciudad}</span>
                </div>
                <div style={{ marginTop: '30px', padding: '25px', background: 'white', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h3>Descripción del Evento</h3>
                    <p>{evento.descripcion}</p>
                </div>
            </section>
            <aside>
                <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
                    <h2>{evento.precio}€ <small style={{fontSize:'0.9rem', fontWeight:'normal'}}>/ entrada</small></h2>
                    <div style={{margin:'20px 0'}}>
                        <label style={{display:'block', fontSize:'0.8rem', fontWeight:'bold'}}>CANTIDAD</label>
                        <input type="number" min="1" value={cantidad} onChange={(e)=>setCantidad(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.2rem', margin:'20px 0'}}>
                        <span>Total</span>
                        <span>{(evento.precio * cantidad).toFixed(2)}€</span>
                    </div>
                    <button onClick={handleReserva} style={{ width: '100%', padding: '15px', borderRadius: '10px', background: '#38bdf8', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>RESERVAR ENTRADAS</button>
                </div>
            </aside>
        </div>
    );
};
export default EventoDetalle;