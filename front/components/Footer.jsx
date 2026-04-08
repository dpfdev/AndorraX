import { Link } from 'react-router-dom';
// Importaciones directas (evitan el error de export)
import { Facebook, Instagram, Twitter } from "lucide-react";
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
        <div className="footer-column">
          <h2 className="footer-logo">ANDORRA<span>X</span></h2>
          <p className="footer-description">
            Tu portal definitivo para descubrir los secretos de los Pirineos. 
            Hoteles, aventuras y eventos exclusivos en el corazón de Andorra.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
          </div>
        </div>

        {/* COLUMNA 2: ENLACES RÁPIDOS */}
        <div className="footer-column">
          <h3>Explorar</h3>
          <ul>
            <li><Link to="/hoteles">Hoteles</Link></li>
            <li><Link to="/actividades">Actividades</Link></li>
            <li><Link to="/eventos">Próximos Eventos</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: SOPORTE / LEGAL */}
        <div className="footer-column">
          <h3>Información</h3>
          <ul>
            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/politica-privacidad">Privacidad</Link></li>
            <li><Link to="/terminos">Términos y Condiciones</Link></li>
            <li><Link to="/cookies">Política de Cookies</Link></li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO */}
        <div className="footer-column">
          <h3>Contacto</h3>
          <ul className="footer-contact">
            <li><MapPin size={16} /> <span>Av. Carlemany, AD700, Andorra</span></li>
            <li><Phone size={16} /> <span>+376 123 456</span></li>
            <li><Mail size={16} /> <span>info@andorrax.ad</span></li>
          </ul>
        </div>

      </div>

      {/* BARRA INFERIOR DE COPYRIGHT */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} ANDORRAX. Todos los derechos reservados.</p>
          <div className="footer-credits">
            Hecho con ❤️ para amantes de la montaña
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;