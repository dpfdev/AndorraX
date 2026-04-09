import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-column brand-col">
                    <Link to="/" className="f-logo-link">
                        <img 
                            src="/andorrax.png" 
                            alt="AndorraX Logo" 
                            className="f-logo-img" 
                        />
                        <span className="f-logo-text">
                            ANDORRA<span className="blue-x">X</span>
                        </span>
                    </Link>
                    <p className="f-tagline">Tu guía premium en los Pirineos.</p>
                    <div className="f-socials">
                        <a href="https://instagram.com/andorrax.es" target="_blank" rel="noreferrer"><Instagram size={20} /></a>
                        <a href="https://twitter.com/AndorraX_es" target="_blank" rel="noreferrer"><Twitter size={20} /></a>
                        <a href="https://facebook.com/andorrax.es" target="_blank" rel="noreferrer"><Facebook size={20} /></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h5 className="f-title">Servicios</h5>
                    <nav className="f-nav">
                        <Link to="/hoteles">Hoteles</Link>
                        <Link to="/actividades">Actividades</Link>
                        <Link to="/eventos">Eventos</Link>
                    </nav>
                </div>

                <div className="footer-column">
                    <h5 className="f-title">Cuenta</h5>
                    <nav className="f-nav">
                        <Link to="/mis-reservas">Mis Reservas</Link>
                        <Link to="/perfil">Mi Perfil</Link>
                    </nav>
                </div>

                <div className="footer-column contact-col">
                    <h5 className="f-title">Contacto</h5>
                    <div className="f-contact-item"><Phone size={14} /> +376 800 123</div>
                    <div className="f-contact-item"><Mail size={14} /> hola@andorrax.es</div>
                    <div className="f-contact-item"><MapPin size={14} /> Andorra la Vella</div>
                </div>
            </div>

            <div className="footer-bar">
                <div className="footer-bar-content">
                    <span>© {year} AndorraX.es</span>
                    <div className="f-legal">
                        <a href="#">Privacidad</a>
                        <span className="dot">•</span>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;