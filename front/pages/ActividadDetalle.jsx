import { ArrowLeft, Calendar, MapPin, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './ActividadDetalle.css';

const ActividadDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [act, setAct] = useState(null);
    const [fecha, setFecha] = useState('');
    const [personas, setPersonas] = useState(1);
    const URL_BASE = "http://localhost:3000";

    useEffect(() => {
        api.get(`/actividades/${id}`)
            .then(res => setAct(Array.isArray(res.data) ? res.data[0] : res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleReserva = async () => {
        if (!localStorage.getItem('token')) return navigate('/login');
        try {
            await api.post('/reservas/actividad', {
                id_actividad: id, 
                fecha, 
                personas,
                precio_total: act.precio * personas
            });
            alert("Sincronización exitosa. Misión confirmada.");
            navigate('/mis-reservas');
        } catch (err) { 
            alert("Error en el enlace de datos."); 
        }
    };

    if (!act) return <div className="loading-wrapper-cyber">/ BOOTING_SYSTEM...</div>;

    return (
        <div className="detail-page-cyber">
            <div className="container-detail-cyber">
                {/* COLUMNA IZQUIERDA: VISUAL Y DATOS */}
                <section className="detail-main-content">
                    <button className="btn-back-cyber" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> VOLVER_AL_PANEL
                    </button>

                    {/* CONTENEDOR DE IMAGEN ADAPTATIVO */}
                    <div className="hero-frame-adaptive">
                        <img 
                            src={act.foto_principal ? `${URL_BASE}${act.foto_principal}` : '/hero.jpg'} 
                            alt={act.nombre}
                            className="img-cyber-full"
                        />
                        <div className="frame-glow-bottom"></div>
                    </div>

                    <div className="info-content-cyber">
                        <div className="tag-id-cyan">REF_ID // 0{act.id_actividad}</div>
                        <h1 className="title-huge-cyber">{act.nombre}</h1>
                        <p className="loc-text-cyber"><MapPin size={18} className="icon-cyan"/> {act.ciudad?.toUpperCase()}</p>
                        
                        <div className="desc-box-cyber">
                            <div className="desc-header-cyber"><Zap size={18} /> ESPECIFICACIONES_TÉCNICAS</div>
                            <p>{act.descripcion}</p>
                        </div>
                    </div>
                </section>

                {/* COLUMNA DERECHA: PANEL DE CONTROL FIXED */}
                <aside className="detail-sidebar-cyber">
                    <div className="booking-card-cyber">
                        <div className="price-header-cyber">
                            {act.precio}€ <small>/ PAX</small>
                        </div>
                        
                        <div className="form-cyber">
                            <div className="input-cyber-group">
                                <label><Calendar size={14} /> FECHA_MISION</label>
                                <input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} />
                            </div>
                            <div className="input-cyber-group">
                                <label><Users size={14} /> UNIDADES_PAX</label>
                                <input type="number" min="1" value={personas} onChange={(e)=>setPersonas(e.target.value)} />
                            </div>
                            
                            <div className="total-row-cyber">
                                <span>TOTAL_ESTIMADO</span>
                                <span className="total-price-cyan">{(act.precio * personas).toFixed(2)}€</span>
                            </div>

                            <button 
                                className={`btn-submit-cyber ${!fecha ? 'locked' : ''}`}
                                onClick={handleReserva} 
                                disabled={!fecha}
                            >
                                {fecha ? 'CONFIRMAR_MISION' : 'ESPERANDO_FECHA'}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ActividadDetalle;