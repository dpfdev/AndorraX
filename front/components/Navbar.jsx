import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    // 1. Estado para el Reloj
    const [dateTime, setDateTime] = useState(new Date());
    // 2. Estado para el Tema (Dark por defecto)
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Actualizar reloj cada segundo
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 3. Función para cambiar tema
    const toggleTheme = () => {
        setIsDark(!isDark);
        // Cambiamos la clase en el body para que el CSS global reaccione
        document.body.className = isDark ? 'light-mode' : 'dark-mode';
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

                {/* NAVEGACIÓN (Centro) */}
                <nav className="nav-block-center">
                    <ul className="nav-menu-list">
                        <li><Link to="/" className="nav-link">/ INICIO</Link></li>
                        <li><Link to="/hoteles" className="nav-link">/ HOTELES</Link></li>
                        <li><Link to="/actividades" className="nav-link">/ ACTIVIDADES</Link></li>
                        <li><Link to="/eventos" className="nav-link">/ EVENTOS</Link></li>
                    </ul>
                </nav>

                {/* STATUS BAR (Derecha) */}
                <div className="nav-block-right">
                    <div className="system-status-pills">
                        
                        {/* Reloj y Clima (Pills Tech) */}
                        <div className="pill hide-mobile">
                            <span className="icon-neon-accent">󱑂</span>
                            {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        
                        <div className="pill hide-mobile">
                            <span className="icon-neon-accent"></span>
                            -2°C
                        </div>

                        {/* TOGGLE DE TEMA ACTIVO */}
                        <div 
                            className={`theme-switcher-pill ${isDark ? 'dark' : 'light'}`} 
                            onClick={toggleTheme}
                        >
                            <div className="switcher-handle"></div>
                            <span className="icon-sun-bg">☀</span>
                            <span className="icon-moon-bg">🌙</span>
                        </div>

                        {/* USUARIO */}
                        <div className="user-profile-tech-pill">
                            <span className="user-name-mono">USER_01</span>
                        </div>

                    </div>
                </div>

            </div>
        </header>
    );
};

export default Navbar;