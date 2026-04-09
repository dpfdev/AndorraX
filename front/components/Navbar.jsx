import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Esto detecta cuando cambias de URL
    const [nombreUsuario, setNombreUsuario] = useState('Usuario');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        
        if (token && userString) {
            try {
                const userData = JSON.parse(userString);
                // IMPORTANTE: Verifica si tu backend devuelve 'nombre' o 'name'
                setNombreUsuario(userData.nombre || userData.name || 'Usuario');
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Error al leer el usuario", e);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [location]); // Se ejecuta cada vez que cambias de página

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header className="main-navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-logo-link">
                    <img src="/andorrax.png" alt="Logo" className="nav-logo-img" />
                    <span className="nav-logo-text">ANDORRA<span className="blue-x">X</span></span>
                </Link>

                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/hoteles" className="nav-link">Hoteles</Link>
                    <Link to="/actividades" className="nav-link">Actividades</Link>
                    <Link to="/eventos" className="nav-link">Eventos</Link>
                </nav>

                <div className="nav-actions">
                    {isLoggedIn ? (
                        <>
                            <Link to="/mis-reservas" className="btn-perfil">
                                <div className="user-avatar"><User size={18} /></div>
                                <div className="user-info-nav">
                                    <span className="u-welcome">Hola,</span>
                                    <span className="u-name">{nombreUsuario}</span>
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="btn-logout"><LogOut size={18} /></button>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login-outline">Iniciar Sesión</Link>
                            <Link to="/registro" className="btn-register-solid">Registrarse</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;