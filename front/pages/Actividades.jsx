import { Activity, Clock, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './HotelesListado.css'; // Reutilizamos el CSS de Hoteles

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const URL_BASE = "http://localhost:3000";

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const res = await api.get('/actividades');
                setActividades(res.data);
            } catch (err) {
                console.error("Error al obtener actividades:", err);
            } finally {
                setCargando(false);
            }
        };
        fetchActividades();
    }, []);

    // Filtrar por nombre o ciudad
    const filtrados = actividades.filter(a => 
        a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (cargando) return (
        <div className="loading-screen-cyber">
            <div className="loader-text">/ ESCANEANDO_RED_DE_ACTIVIDADES...</div>
        </div>
    );

    return (
        <div className="hoteles-page"> {/* Clase base de Hoteles */}
            <div className="container">
                
                {/* CABECERA Y BUSCADOR (Igual que Hoteles) */}
                <header className="listado-header">
                    <div className="header-info">
                        <span className="cyber-tag">LOCALIZADOR_DE_MISIONES</span>
                        <h1>ACTIVIDADES_DISPONIBLES</h1>
                    </div>
                    
                    <div className="search-box-cyber">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="BUSCAR POR NOMBRE O CIUDAD..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </header>

                {/* GRID DE TARJETAS (Estructura idéntica a Hoteles) */}
                <div className="hoteles-grid">
                    {filtrados.length > 0 ? (
                        filtrados.map((act) => (
                            <Link 
                                to={`/actividades/${act.id_actividad}`} 
                                key={act.id_actividad} 
                                className="hotel-card-cyber"
                            >
                                <div className="card-image-wrapper">
                                    <img 
                                        src={act.foto_principal ? `${URL_BASE}${act.foto_principal}` : '/hero.jpg'} 
                                        alt={act.nombre} 
                                    />
                                    <div className="price-badge">
                                        {act.precio}€<span>/pax</span>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <div className="card-top">
                                        <span className="hotel-stars">
                                            <Activity size={12} fill="var(--accent)" strokeWidth={0} />
                                            <span style={{fontSize: '10px', marginLeft: '5px', color: 'var(--accent)'}}>
                                                MISIÓN_ACTIVA
                                            </span>
                                        </span>
                                        <span className="hotel-id">REF_0{act.id_actividad}</span>
                                    </div>

                                    <h2>{act.nombre}</h2>
                                    
                                    <div className="hotel-location">
                                        <MapPin size={14} className="icon-cyan" />
                                        <span>{act.ciudad?.toUpperCase()}</span>
                                        <Clock size={14} className="icon-cyan" style={{marginLeft: '15px'}} />
                                        <span style={{marginLeft: '5px'}}>{act.duracion || '2H'}</span>
                                    </div>

                                    <div className="card-footer">
                                        <span className="view-more">VER_MISION</span>
                                        <div className="footer-line"></div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-results-cyber">
                            <Activity size={48} />
                            <p>NO SE HAN ENCONTRADO MISIONES DISPONIBLES.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Actividades;