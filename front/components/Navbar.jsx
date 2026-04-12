import { Clock, LogIn, LogOut, Moon, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState(new Date());
    const [isDark, setIsDark] = useState(true);
    
    // Estados para usuario
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Reloj
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        
        // Recuperar usuario del localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => clearInterval(timer);
    }, [token]); // Se actualiza si el token cambia

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

                {/* NAVEGACIÓN */}
                <nav className="nav-block-center">
                    <ul className="nav-menu-list">
                        <li><Link to="/" className="nav-link">/ INICIO</Link></li>
                        <li><Link to="/hoteles" className="nav-link">/ HOTELES</Link></li>
                        <li><Link to="/actividades" className="nav-link">/ ACTIVIDADES</Link></li>
                        <li><Link to="/eventos" className="nav-link">/ EVENTOS</Link></li>
                    </ul>
                </nav>

                {/* STATUS BAR */}
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

                        {/* LÓGICA DE USUARIO */}
                        {user ? (
                            <>
                                <div className="user-profile-tech-pill">
                                    <User size={14} className="icon-cyan" />
                                    <span className="user-name-mono">HOLA, {user.nombre?.toUpperCase()}</span>
                                </div>
                                <button onClick={handleLogout} className="pill-logout">
                                    <LogOut size={14} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="pill-login">
                                <LogIn size={14} />
                                <span>ACCEDER</span>
                            </Link>
                        )}

                    </div>
                </div>

            </div>
        </header>
    );
};

export default Navbar;