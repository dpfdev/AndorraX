import { Clock, LogIn, LogOut, Moon, Sun, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dateTime, setDateTime] = useState(new Date());
    const [isDark, setIsDark] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. Reloj en tiempo real
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        
        // 2. Sincronizar usuario desde localStorage
        const syncUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Error al parsear usuario", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        syncUser();

        // Escuchar cambios en otras pestañas
        window.addEventListener('storage', syncUser);
        
        return () => {
            clearInterval(timer);
            window.removeEventListener('storage', syncUser);
        };
    }, [location]); // Se refresca al cambiar de ruta

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.body.className = newTheme ? 'dark-mode' : 'light-mode';
    };

    return (
        <header className={`main-navbar ${isDark ? 'dark' : 'light'}`}>
            <div className="navbar-container">
                
                {/* LOGO */}
                <div className="nav-block-left">
                    <Link to="/" className="nav-logo-link">
                        <span className="nav-logo-text">
                            ANDORRA<span className="blue-x-glitch">X</span>
                        </span>
                    </Link>
                </div>

                {/* NAVEGACIÓN CENTRAL */}
                <nav className="nav-block-center">
                    <ul className="nav-menu-list">
                        <li><Link to="/" className="nav-link">/ INICIO</Link></li>
                        <li><Link to="/hoteles" className="nav-link">/ HOTELES</Link></li>
                        <li><Link to="/actividades" className="nav-link">/ ACTIVIDADES</Link></li>
                        <li><Link to="/eventos" className="nav-link">/ EVENTOS</Link></li>
                    </ul>
                </nav>

                {/* STATUS BAR (DERECHA) */}
                <div className="nav-block-right">
                    <div className="system-status-pills">
                        
                        {/* Reloj */}
                        <div className="pill hide-mobile">
                            <Clock size={14} className="icon-neon-accent" />
                            <span>{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Switcher de Tema */}
                        <div className={`theme-switcher-pill ${isDark ? 'dark' : 'light'}`} onClick={toggleTheme}>
                            <div className="switcher-handle"></div>
                            <Sun size={12} className="icon-sun-bg" />
                            <Moon size={12} className="icon-moon-bg" />
                        </div>

                        {/* SECCIÓN DE USUARIO */}
                        {user ? (
                            <div className="auth-group">
                                {/* Saludo interactivo que lleva a Mis Reservas */}
                                <Link to="/mis-reservas" className="user-profile-link">
                                    <div className="user-profile-tech-pill interactive">
                                        <User size={14} className="icon-cyan" />
                                        <span className="user-name-mono">
                                            HOLA, {user.nombre?.toUpperCase() || 'USUARIO'}
                                        </span>
                                        <span className="pill-arrow">›</span>
                                    </div>
                                </Link>
                                
                                <button onClick={handleLogout} className="pill-logout" title="Cerrar Sesión">
                                    <LogOut size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="auth-group">
                                <Link to="/login" className="pill-login">
                                    <LogIn size={14} />
                                    <span>LOGIN</span>
                                </Link>
                                <Link to="/registro" className="pill-register">
                                    <UserPlus size={14} />
                                    <span>REGISTRARSE</span>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </header>
    );
};

export default Navbar;