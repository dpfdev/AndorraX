import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/login.css';
import api from '../services/api';

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
      // 1. Petición al servidor
      const res = await api.post('/auth/login', formData);
      
      // 2. Guardamos Token y Usuario (clave 'usuario' para el Navbar)
      localStorage.setItem('token', res.data.token);
      const userData = res.data.user || res.data.usuario;
      localStorage.setItem('usuario', JSON.stringify(userData));

      // 3. Redirección limpia al inicio
      // Usamos href para que la página se refresque totalmente y el Navbar se entere
      window.location.href = '/'; 
      
    } catch (err) {
      setError(err.response?.data?.error || "Credenciales incorrectas");
      setLoading(false); // Reactivamos el botón si hay error
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* PANEL IZQUIERDO - DISEÑO BRANDED */}
        <div 
          className="brand-panel"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 50, 80, 0.7), rgba(0, 30, 60, 0.8)), 
            url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1000&auto=format&fit=crop')`
          }}
        >
          <div className="brand-content">
            <div className="logo-area">
              <i className="fas fa-skiing"></i>
              <span>Andorra<span className="logo-accent">❄️</span>Snow</span>
            </div>
            
            <h1 className="brand-title">
              Esquía en la <span className="brand-highlight">nieve</span><br />de los Pirineos
            </h1>
            
            <ul className="feature-list">
              <li><i className="fas fa-check-circle"></i> Grandvalira · 210km de pistas</li>
              <li><i className="fas fa-check-circle"></i> Vallnord · Pal Arinsal</li>
              <li><i className="fas fa-check-circle"></i> Clases de esquí y snow</li>
              <li><i className="fas fa-check-circle"></i> Après-ski · Gastronomía</li>
            </ul>

            <div className="testimonial">
              <p>"Las mejores pistas de los Pirineos. Nieve garantizada."</p>
              <div className="author">
                <div 
                  className="author-img"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&auto=format&fit=crop')` }}
                ></div>
                <div className="author-info">
                  <span className="author-name">Carlos Martínez</span><br/>
                  <small>Esquiador · 15 temporadas</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO - FORMULARIO */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Bienvenido esquiador</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              <i className="fas fa-snowflake"></i> Accede a tu forfait digital
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group-login">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="tú@andorraesqui.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group-login">
              <label>Contraseña</label>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Recordar
              </label>
              <Link to="/registro" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                ¿No tienes cuenta?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn-login-submit" 
              disabled={loading}
              style={{ backgroundColor: loading ? '#94a3b8' : '#0f172a' }}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <button className="btn-back-login" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default AndorraLogin;