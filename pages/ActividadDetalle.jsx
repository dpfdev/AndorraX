import { ArrowLeft, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ActividadDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [act, setAct] = useState(null);
    const [fecha, setFecha] = useState('');
    const [personas, setPersonas] = useState(1);

    useEffect(() => {
        api.get(`/actividades/${id}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setAct(data);
            })
            .catch(err => console.error("Error cargando detalle:", err));
    }, [id]);

    const handleReserva = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            await api.post('/reservas/actividad', {
                id_actividad: id, fecha, personas,
                precio_total: act.precio * personas
            });
            alert("¡Reserva confirmada!");
            navigate('/mis-reservas');
        } catch (err) { alert("Error al reservar"); }
    };

    if (!act) return <div style={{textAlign:'center', padding:'100px'}}>Cargando aventura...</div>;

    return (
        <div className="container" style={{ padding: '40px 0', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
            <section>
                <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                    <ArrowLeft size={18} /> VOLVER
                </button>
                <div style={{ width: '100%', height: '400px', backgroundColor: '#f1f5f9', borderRadius: '20px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                    <img 
                        src={act.foto_principal ? `http://localhost:3000${act.foto_principal}` : 'https://images.unsplash.com/photo-1551632811-561732d1e346'} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        alt={act.nombre}
                    />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginTop: '25px' }}>{act.nombre}</h1>
                <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '1.1rem' }}><MapPin size={20}/> {act.ciudad}</p>
                <div style={{ marginTop: '30px', padding: '25px', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{marginBottom:'15px'}}>Sobre esta actividad</h3>
                    <p style={{lineHeight:'1.6', color:'#475569'}}>{act.descripcion}</p>
                </div>
            </section>

            <aside>
                <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
                    <h2 style={{fontSize: '1.8rem'}}>{act.precio}€ <small style={{fontSize:'0.9rem', color:'#64748b', fontWeight:'normal'}}>/ persona</small></h2>
                    <div style={{margin: '25px 0'}}>
                        <label style={{display:'block', marginBottom:'8px', fontWeight:'bold', fontSize:'0.8rem'}}>SELECCIONA FECHA</label>
                        <input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #cbd5e1'}} />
                    </div>
                    <div style={{margin: '25px 0'}}>
                        <label style={{display:'block', marginBottom:'8px', fontWeight:'bold', fontSize:'0.8rem'}}>Nº PERSONAS</label>
                        <input type="number" min="1" value={personas} onChange={(e)=>setPersonas(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #cbd5e1'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.3rem', padding: '15px 0', borderTop: '1px solid #f1f5f9'}}>
                        <span>Total:</span>
                        <span>{(act.precio * personas).toFixed(2)}€</span>
                    </div>
                    <button onClick={handleReserva} disabled={!fecha} style={{ width: '100%', padding: '18px', borderRadius: '12px', background: fecha ? '#0f172a' : '#94a3b8', color: 'white', border: 'none', fontWeight: 'bold', cursor: fecha ? 'pointer' : 'not-allowed', marginTop: '10px' }}>RESERVAR ACTIVIDAD</button>
                </div>
            </aside>
        </div>
    );
};
export default ActividadDetalle;