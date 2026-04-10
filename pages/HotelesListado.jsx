import { AnimatePresence, motion } from 'framer-motion'; // Importamos animaciones
import {
  ArrowUpDown,
  Filter,
  Globe,
  RotateCcw,
  Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import HotelCard from '../components/HotelCard';
import api from '../services/api';
import './HotelesListado.css';

const Hoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState(''); 
  const [filtros, setFiltros] = useState({
    ciudad: '', pais: '', estrellas: '', precioMax: '', soloActivos: false
  });

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        const res = await api.get('/hoteles');
        setHoteles(res.data);
        setFiltrados(res.data);
      } catch (err) {
        console.error("Error al cargar hoteles:", err);
      }
    };
    fetchHoteles();
  }, []);

  useEffect(() => {
    let resultado = [...hoteles].filter(h => {
      const coincideNombre = h.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCiudad = filtros.ciudad === '' || h.ciudad === filtros.ciudad;
      const coincidePais = filtros.pais === '' || h.pais === filtros.pais;
      const coincideEstrellas = filtros.estrellas === '' || h.categoria_estrellas === parseInt(filtros.estrellas);
      const coincidePrecio = filtros.precioMax === '' || h.precio_base_noche <= parseInt(filtros.precioMax);
      const coincideActivo = !filtros.soloActivos || h.activo === 1;
      return coincideNombre && coincideCiudad && coincidePais && coincideEstrellas && coincidePrecio && coincideActivo;
    });

    if (orden === 'asc') resultado.sort((a, b) => a.precio_base_noche - b.precio_base_noche);
    else if (orden === 'desc') resultado.sort((a, b) => b.precio_base_noche - a.precio_base_noche);

    setFiltrados(resultado);
  }, [busqueda, filtros, hoteles, orden]);

  const resetFiltros = () => {
    setBusqueda(''); setOrden('');
    setFiltros({ ciudad: '', pais: '', estrellas: '', precioMax: '', soloActivos: false });
  };

  const ciudadesUnicas = [...new Set(hoteles.map(h => h.ciudad))];
  const paisesUnicos = [...new Set(hoteles.map(h => h.pais))];

  return (
    <div className="hoteles-page">
      <header className="hoteles-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <h1>Reserva tu <span>Estancia</span></h1>
          <p>Experiencias exclusivas en el corazón de la nieve</p>
        </motion.div>
      </header>

      <main className="container main-layout">
        <aside className="sidebar-filters">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <Filter size={20} />
              <span>Filtros Avanzados</span>
            </div>

            <div className="filter-group">
              <label>Buscar Hotel</label>
              <div className="input-with-icon">
                <Search size={16} />
                <input type="text" placeholder="Nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <label>País</label>
              <div className="input-with-icon">
                <Globe size={16} />
                <select value={filtros.pais} onChange={(e) => setFiltros({...filtros, pais: e.target.value})}>
                  <option value="">Todos los países</option>
                  {paisesUnicos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="filter-group">
              <label>Ordenar Precio</label>
              <div className="input-with-icon">
                <ArrowUpDown size={16} />
                <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                  <option value="">Por defecto</option>
                  <option value="asc">Más económicos</option>
                  <option value="desc">Más exclusivos</option>
                </select>
              </div>
            </div>

            <div className="filter-group">
              <label>Precio máx: {filtros.precioMax || 1500}€</label>
              <input type="range" min="0" max="1500" step="50" value={filtros.precioMax || 1500} onChange={(e) => setFiltros({...filtros, precioMax: e.target.value})} className="range-input" />
            </div>

            <div className="filter-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={filtros.soloActivos} onChange={(e) => setFiltros({...filtros, soloActivos: e.target.checked})} />
                <span className="custom-checkbox"></span>
                Solo disponibles
              </label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-reset-sidebar" 
              onClick={resetFiltros}
            >
              <RotateCcw size={16} /> Limpiar Filtros
            </motion.button>
          </div>
        </aside>

        <section className="results-content">
          <div className="results-info">
            Mostrando <strong>{filtrados.length}</strong> resultados
          </div>
          
          <motion.div 
            layout // Esto anima el movimiento de las tarjetas cuando los filtros cambian
            className="hoteles-grid"
          >
            <AnimatePresence>
              {filtrados.map((h, index) => (
                <motion.div
                  key={h.id_hotel}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <HotelCard hotel={h} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Hoteles;