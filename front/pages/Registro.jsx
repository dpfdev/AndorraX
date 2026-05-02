import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/AndorraLogin.css';
import api from '../src/services/api';

const Registro = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [mensaje, setMensaje] = useState({ texto: '', esError: false });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ texto: '', esError: false });

        try {
            await api.post('/auth/registrar', formData);
            setMensaje({ texto: "Identidad registrada. Redirigiendo...", esError: false });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMensaje({ 
                texto: err.response?.data?.error || "No se pudo completar el registro.", 
                esError: true 
            });
            setLoading(false);
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
                        url('https://images.unsplash.com/photo-1520901117041-305e683611f6?w=1000&auto=format&fit=crop')`
                    }}
                >
                    <div className="brand-content">
                        <div className="logo-area">
                            <div className="logo-icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <span>Andorra<span className="logo-accent">❄️</span>Join</span>
                        </div>
                        
                        <h1 className="brand-title">
                            Crea tu <span className="brand-highlight">pasaporte</span><br />a la aventura
                        </h1>
                        
                        <ul className="feature-list">
                            <li><i className="fas fa-id-card"></i> Forfait Digital Personalizado</li>
                            <li><i className="fas fa-history"></i> Historial de Actividades</li>
                            <li><i className="fas fa-tags"></i> Ofertas exclusivas residentes</li>
                        </ul>

                        <div className="location-tag" style={{marginTop: 'auto'}}>
                            <i className="fas fa-snowflake"></i> Registro de Nuevos Esquiadores
                        </div>
                    </div>
                </div>

                {/* PANEL DERECHO */}
                <div className="form-panel">
                    <div className="form-header">
                        <h2>Nueva Identidad</h2>
                        <p><i className="fas fa-snowflake"></i> Completa tu perfil ártico</p>
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
                            <label>Nombre Completo</label>
                            <i className="fas fa-user input-icon"></i>
                            <input
                                type="text"
                                placeholder="Ej. John Doe"
                                required
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            />
                        </div>

                        <div className="input-group">
                            <label>Email de Usuario</label>
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                placeholder="user@andorra.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Procesando...' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <p className="signup-prompt">
                        ¿Ya eres del equipo? 
                        <Link to="/login">Inicia Sesión</Link>
                    </p>

                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Registro;