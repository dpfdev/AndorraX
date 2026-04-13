import { Building2, MapPin, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../src/services/api';
import './HotelesListado.css';

const HotelesListado = () => {
    const [hoteles, setHoteles] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchHoteles = async () => {
            try {
                const res = await api.get('/hoteles');
                setHoteles(res.data);
            } catch (err) {
                console.error("Error al obtener hoteles:", err);
            } finally {
                setCargando(false);
            }
        };
        fetchHoteles();
    }, []);

    // Filtrar por nombre o ciudad
    const hotelesFiltrados = hoteles.filter(h => 
        h.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        h.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (cargando) return (
        <div className="loading-screen-cyber">
            <div className="loader-text">/ ESCANEANDO_RED_DE_ALOJAMIENTOS...</div>
        </div>
    );

    return (
        <div className="hoteles-page">
            <div className="container">
                
                {/* CABECERA Y BUSCADOR */}
                <header className="listado-header">
                    <div className="header-info">
                        <span className="cyber-tag">LOCALIZADOR_DE_RECURSOS</span>
                        <h1>HOTELES_DISPONIBLES</h1>
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

                {/* GRID DE TARJETAS */}
                <div className="hoteles-grid">
                    {hotelesFiltrados.length > 0 ? (
                        hotelesFiltrados.map((hotel) => (
                            <Link 
                                /* CORRECCIÓN AQUÍ: la ruta debe ser /hoteles/ coincidiendo con App.jsx */
                                to={`/hoteles/${hotel.id_hotel}`} 
                                key={hotel.id_hotel} 
                                className="hotel-card-cyber"
                            >
                                <div className="card-image-wrapper">
                                    <img 
                                        src={hotel.foto_principal ? `http://localhost:3000${hotel.foto_principal}` : '/hero.jpg'} 
                                        alt={hotel.nombre} 
                                    />
                                    <div className="price-badge">
                                        {hotel.precio_base_noche}€<span>/noche</span>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <div className="card-top">
                                        <span className="hotel-stars">
                                            {[...Array(Number(hotel.categoria_estrellas) || 0)].map((_, i) => (
                                                <Star key={i} size={12} fill="var(--accent)" strokeWidth={0} />
                                            ))}
                                        </span>
                                        <span className="hotel-id">ID_0{hotel.id_hotel}</span>
                                    </div>

                                    <h2>{hotel.nombre}</h2>
                                    
                                    <div className="hotel-location">
                                        <MapPin size={14} className="icon-cyan" />
                                        <span>{hotel.ciudad.toUpperCase()}</span>
                                    </div>

                                    <div className="card-footer">
                                        <span className="view-more">VER_DETALLES</span>
                                        <div className="footer-line"></div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-results-cyber">
                            <Building2 size={48} />
                            <p>NO SE HAN ENCONTRADO ALOJAMIENTOS EN ESTA ZONA.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelesListado;