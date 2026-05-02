import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/AndorraLogin.css';
import api from '../src/services/api';

const AndorraLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      
      // 1. Guardamos el Token para las peticiones
      localStorage.setItem('token', res.data.token);
      
      // 2. Extraemos el usuario (aseguramos compatibilidad con el backend)
      const userData = res.data.user || res.data.usuario;

      if (userData) {
        // 3. GUARDAMOS COMO 'user' (Igual que tu Navbar)
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 4. Redirección forzada para limpiar el estado de React y refrescar Navbar
        window.location.href = '/'; 
      } else {
        setError("Error: El servidor no envió los datos del usuario.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Credenciales incorrectas o error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* PANEL IZQUIERDO: BRANDING */}
        <div 
          className="brand-panel"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(11, 43, 61, 0.85), rgba(10, 31, 44, 0.95)), 
            url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1000&auto=format&fit=crop')`
          }}
        >
          <div className="brand-content">
            <div className="logo-area">
              <div className="logo-icon">
                <i className="fas fa-skiing"></i>
              </div>
              <span>Andorra<span className="logo-accent">❄️</span>Snow</span>
            </div>
            
            <h1 className="brand-title">
              Esquía en la <span className="brand-highlight">nieve</span><br />de los Pirineos
            </h1>
            
            <ul className="feature-list">
              <li><i className="fas fa-snowflake"></i> Grandvalira · 210km pistas</li>
              <li><i className="fas fa-mountain"></i> Vallnord · Pal Arinsal</li>
              <li><i className="fas fa-map-marker-alt"></i> Forfait Digital OMEGA</li>
            </ul>

            <div className="testimonial">
              <p>"La mejor experiencia de nieve. Forfaits digitales rápidos y pistas impecables."</p>
              <div className="author">
                <div 
                  className="author-img"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&auto=format&fit=crop')` }}
                ></div>
                <div className="author-info">
                  <span className="author-name">Carlos Martínez</span>
                  <span className="author-title">Esquiador Pro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: FORMULARIO */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Bienvenido</h2>
            <p><i className="fas fa-user-circle"></i> Accede a tu terminal de usuario</p>
          </div>

          {error && (
            <div className="error-message-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <i className="fas fa-envelope input-icon"></i>
              <input
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <i className="fas fa-lock input-icon"></i>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="forgot-row">
              <label className="remember">
                <input type="checkbox" defaultChecked /> Recordar
              </label>
              <Link to="/olvide-password" title="Recuperar contraseña" className="forgot-link">
                ¿Olvidaste tu clave?
              </Link>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'ACCEDIENDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          <div className="alternative-login">
            <p>O accede con</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-google"></i></a>
              <a href="#"><i className="fab fa-apple"></i></a>
            </div>
          </div>

          <p className="signup-prompt">
            ¿No tienes cuenta? 
            <Link to="/registro">Regístrate ahora</Link>
          </p>

          <button className="btn-back" type="button" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i> Volver a la web
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default AndorraLogin;