import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/login.css'; // Usamos el mismo CSS para mantener el estilo
import api from '../services/api';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
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
      await api.post('/auth/registrar', formData);
      alert("¡Cuenta creada con éxito! Prepárate para la nieve.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* PANEL IZQUIERDO - IMAGEN DE REGISTRO (Cambiamos la foto por una de snowboard/nieve) */}
        <div 
          className="brand-panel"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 50, 80, 0.7), rgba(0, 30, 60, 0.8)), 
            url('https://images.unsplash.com/photo-1414238974773-057baf98df83?w=1000&auto=format&fit=crop')`
          }}
        >
          <div className="brand-content">
            <div className="logo-area">
              <i className="fas fa-skiing"></i>
              <span>Andorra<span className="logo-accent">❄️</span>Snow</span>
            </div>
            
            <h1 className="brand-title">
              Crea tu cuenta y <span className="brand-highlight">empieza</span><br />tu aventura
            </h1>
            
            <ul className="feature-list">
              <li><i className="fas fa-snowflake"></i> Reserva hoteles a pie de pista</li>
              <li><i className="fas fa-snowflake"></i> Alquiler de material premium</li>
              <li><i className="fas fa-snowflake"></i> Forfaits exclusivos</li>
              <li><i className="fas fa-snowflake"></i> Comunidad de esquiadores</li>
            </ul>

            <div className="testimonial">
              <p>"Registrarme fue el primer paso para las mejores vacaciones de mi vida."</p>
              <div className="author">
                <div 
                  className="author-img"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop')` }}
                ></div>
                <div className="author-info">
                  <span className="author-name">Elena Rivas</span><br/>
                  <small>Snowboarder · Pro Member</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO - FORMULARIO DE REGISTRO */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Únete a nosotros</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              <i className="fas fa-user-plus"></i> Crea tu perfil de esquiador
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group-login">
              <label>Nombre Completo</label>
              <input
                name="nombre"
                type="text"
                placeholder="Ej. Juan Pérez"
                required
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn-login-submit" 
              disabled={loading}
              style={{ backgroundColor: loading ? '#94a3b8' : '#0f172a' }}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse ahora'}
            </button>
          </form>

          <div className="signup-prompt" style={{ marginTop: '20px', textAlign: 'center' }}>
            ¿Ya eres miembro? <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</Link>
          </div>
          
          <button className="btn-back-login" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Registro;