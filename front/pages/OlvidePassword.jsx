import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/AndorraLogin.css';
import api from '../src/services/api';

const OlvidePassword = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', esError: false });
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', esError: false });
        setCargando(true);

        try {
            const response = await api.post('/auth/olvide-password', { email });
            setMensaje({ texto: response.data.message, esError: false });
        } catch (err) {
            setMensaje({ 
                texto: err.response?.data?.error || 'No se encontró el correo', 
                esError: true 
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                
                {/* PANEL IZQUIERDO */}
                <div 
                    className="brand-panel"
                    style={{
                        backgroundImage: `linear-gradient(135deg, rgba(11, 43, 61, 0.85), rgba(10, 31, 44, 0.95)), 
                        url('https://images.unsplash.com/photo-1517231939932-d32d20b60200?w=1000&auto=format&fit=crop')`
                    }}
                >
                    <div className="brand-content">
                        <div className="logo-area">
                            <div className="logo-icon">
                                <i className="fas fa-key"></i>
                            </div>
                            <span>Andorra<span className="logo-accent">❄️</span>Help</span>
                        </div>
                        
                        <h1 className="brand-title">
                            Recupera tu <span className="brand-highlight">acceso</span><br />a las montañas
                        </h1>
                        
                        <ul className="feature-list">
                            <li><i className="fas fa-paper-plane"></i> Envío de enlace instantáneo</li>
                            <li><i className="fas fa-user-shield"></i> Verificación Segura</li>
                        </ul>

                        <div className="location-tag" style={{marginTop: 'auto'}}>
                            <i className="fas fa-info-circle"></i> Soporte de Cuenta Andorra Snow
                        </div>
                    </div>
                </div>

                {/* PANEL DERECHO */}
                <div className="form-panel">
                    <div className="form-header">
                        <h2>¿Olvidaste tu clave?</h2>
                        <p><i className="fas fa-envelope-open-text"></i> Te enviaremos un código de rescate</p>
                    </div>

                    {mensaje.texto && (
                        <div style={{ 
                            backgroundColor: mensaje.esError ? '#fee2e2' : '#dcfce7', 
                            color: mensaje.esError ? '#dc2626' : '#15803d', 
                            padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center', border: '1px solid currentColor' 
                        }}>
                            {mensaje.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Tu Correo Electrónico</label>
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-login" disabled={cargando}>
                            {cargando ? 'Enviando...' : 'Enviar instrucciones'}
                        </button>
                    </form>

                    <p className="signup-prompt">
                        ¿Ya la recordaste? 
                        <Link to="/login">Inicia Sesión</Link>
                    </p>

                    <button className="btn-back" onClick={() => navigate('/login')}>
                        <i className="fas fa-arrow-left"></i> Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OlvidePassword;