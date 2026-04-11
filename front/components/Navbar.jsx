import { LogOut, MapPin, Moon, Sun, Thermometer, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    // Iniciamos en false para Light Mode (Nieve) por defecto
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('Invitado');
    const [weather, setWeather] = useState({ temp: '--', city: 'ANDORRA' });

    const fetchWeatherData = useCallback(async (lat, lon) => {
        try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`);
            const weatherData = await weatherRes.json();
            
            // Nominatim para el nombre de la ciudad
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            const cityName = geoData.address.city || geoData.address.town || "ANDORRA";

            setWeather({
                temp: Math.round(weatherData.current.temperature_2m),
                city: cityName.toUpperCase()
            });
        } catch (err) {
            setWeather({ temp: '??', city: "ANDORRA" });
        }
    }, []);

    useEffect(() => {
        // Cargar datos de usuario desde localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.nombre) {
            setNombreUsuario(user.nombre);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeatherData(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeatherData(42.5063, 1.5218)
            );
        }
    }, [fetchWeatherData]);

    // EFECTO DE CAMBIO DE TEMA: Aplica la clase al body
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="main-navbar">
            <div className="navbar-container">
                
                {/* 1. IZQUIERDA: LOGO (Con más presencia) */}
                <div className="nav-block-left">
                    <Link to="/" className="nav-logo-link">
                        <span className="nav-logo-text">
                            ANDORRA<span className="blue-x-glitch">X</span>
                        </span>
                    </Link>
                </div>

                {/* 2. CENTRO: NAVEGACIÓN (Estilo Tech-Mono) */}
                <nav className="nav-block-center">
                    <ul className="nav-menu-list">
                        <li><Link to="/" className="nav-link">/ INICIO</Link></li>
                        <li><Link to="/hoteles" className="nav-link">/ HOTELES</Link></li>
                        <li><Link to="/actividades" className="nav-link">/ ACTIVIDADES</Link></li>
                        <li><Link to="/eventos" className="nav-link">/ EVENTOS</Link></li>
                    </ul>
                </nav>

                {/* 3. DERECHA: STATUS, USER, Y TOGGLE MAESTRO */}
                <div className="nav-block-right">
                    <div className="system-status-pills">
                        
                        {/* Clima (Oculto en móvil) */}
                        <div className="pill hide-tablet">
                            <MapPin size={12} className="icon-neon-accent" />
                            <span className="city-name-mono">{weather.city}</span>
                        </div>
                        <div className="pill hide-tablet temp-pill">
                            <Thermometer size={14} className="icon-neon-accent" />
                            <span>{weather.temp}°C</span>
                        </div>

                        {/* EL NUEVO TOGGLE MAESTRO (Tipo Pill Animado) */}
                        <div className={`theme-switcher-pill ${isDarkMode ? 'dark' : 'light'}`} onClick={() => setIsDarkMode(!isDarkMode)}>
                            <div className="switcher-handle">
                                {isDarkMode ? <Moon size={14} strokeWidth={3} /> : <Sun size={14} strokeWidth={3} />}
                            </div>
                            <Sun className="icon-sun-bg" size={16} />
                            <Moon className="icon-moon-bg" size={16} />
                        </div>

                        {/* Perfil Usuario (Estilo Tech) */}
                        <div className="user-profile-tech-pill">
                            <User size={16} className="icon-neon-accent" />
                            <span className="user-name-mono">{nombreUsuario}</span>
                        </div>

                        {/* Botón Salir (Minimal, peligro rojo) */}
                        <button className="logout-btn-tech" onClick={handleLogout} title="Cerrar Sesión">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;