import { Clock, LogIn, LogOut, Moon, Sun, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Para detectar cambios de ruta y refrescar el estado
    const [dateTime, setDateTime] = useState(new Date());
    const [isDark, setIsDark] = useState(true);
    
    // Estado del usuario
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. Reloj en tiempo real
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        
        // 2. Comprobar si hay usuario cada vez que cambiamos de página
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }

        return () => clearInterval(timer);
    }, [location]); // Se ejecuta cada vez que cambia la URL

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

                        {/* --- LÓGICA CONDICIONAL DE USUARIO --- */}
                        {user ? (
                            /* SI ESTÁ CONECTADO */
                            <div className="auth-group">
                                <div className="user-profile-tech-pill">
                                    <User size={14} className="icon-cyan" />
                                    <span className="user-name-mono">HOLA, {user.nombre?.toUpperCase()}</span>
                                </div>
                                <button onClick={handleLogout} className="pill-logout" title="Cerrar Sesión">
                                    <LogOut size={14} />
                                </button>
                            </div>
                        ) : (
                            /* SI NO ESTÁ CONECTADO */
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