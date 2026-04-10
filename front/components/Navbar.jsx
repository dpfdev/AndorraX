import { Clock, LogOut, MapPin, Moon, Sun, Thermometer, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [nombreUsuario, setNombreUsuario] = useState('Usuario');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Estados de Clima y Reloj
    const [dateTime, setDateTime] = useState(new Date());
    const [weather, setWeather] = useState({ temp: '--', city: 'BUSCANDO...' });

    useEffect(() => {
        // 1. Reloj
        const timer = setInterval(() => setDateTime(new Date()), 1000);

        // 2. Lógica de Usuario
        const userString = localStorage.getItem('user');
        if (userString) {
            const userData = JSON.parse(userString);
            setNombreUsuario(userData.nombre || userData.name || 'Usuario');
            setIsLoggedIn(true);
        }

        // 3. CLIMA REAL CON OPEN-METEO (Sin API Key)
        const getRealInfo = async (lat, lon) => {
            try {
                // A. Obtenemos el nombre de la ciudad mediante Reverse Geocoding (Gratis)
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const geoData = await geoRes.json();
                const cityName = geoData.address.city || geoData.address.town || geoData.address.village || "UBICACIÓN";

                // B. Obtenemos el clima de Open-Meteo
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`);
                const weatherData = await weatherRes.json();

                setWeather({
                    temp: Math.round(weatherData.current.temperature_2m),
                    city: cityName.toUpperCase()
                });
            } catch (err) {
                console.error("Error en Open-Meteo:", err);
                setWeather({ temp: '??', city: "ANDORRA" });
            }
        };

        // Solicitar GPS
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => getRealInfo(pos.coords.latitude, pos.coords.longitude),
                () => getRealInfo(42.5063, 1.5218) // Fallback a Andorra
            );
        } else {
            getRealInfo(42.5063, 1.5218);
        }

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    return (
        <header className="main-navbar">
            <div className="navbar-container">
                <div className="nav-block-left">
                    <Link to="/" className="nav-logo-link">
                        <span className="nav-logo-text">ANDORRA<span className="blue-x">X</span></span>
                    </Link>
                </div>

                <nav className="nav-block-center">
                    <ul className="nav-menu-list">
                        <li><Link to="/" className="nav-link">Inicio</Link></li>
                        <li><Link to="/hoteles" className="nav-link">Hoteles</Link></li>
                        <li><Link to="/actividades" className="nav-link">Actividades</Link></li>
                        <li><Link to="/eventos" className="nav-link">Eventos</Link></li>
                    </ul>
                </nav>

                <div className="nav-block-right">
                    <div className="system-status-pills">
                        <div className="pill location-pill">
                            <MapPin size={12} className="neon-icon" />
                            <span className="city-name">{weather.city}</span>
                        </div>
                        <div className="pill">
                            <Thermometer size={14} className="neon-icon" />
                            <span>{weather.temp}°C</span>
                        </div>
                        <div className="pill clock-pill">
                            <Clock size={14} />
                            <span>{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>

                    <div className="user-section">
                        {isLoggedIn ? (
                            <div className="user-logged">
                                <Link to="/mis-reservas" className="user-link">
                                    <div className="avatar-circle"><User size={14} /></div>
                                    <span className="user-name-text">{nombreUsuario}</span>
                                </Link>
                                <button onClick={() => {localStorage.clear(); window.location.reload();}} className="logout-icon-btn">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="auth-group">
                                <Link to="/login" className="login-link">Login</Link>
                                <Link to="/registro" className="register-btn">Join</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;