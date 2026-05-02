import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../pages/AndorraLogin.css'; // Reutilizamos el estilo global
import api from '../src/services/api';

const RestablecerPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', esError: false });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMensaje({ texto: 'Las contraseñas no coinciden', esError: true });
            return;
        }

        setLoading(true);
        setMensaje({ texto: '', esError: false });

        try {
            const res = await api.post(`/auth/restablecer-password/${token}`, { password });
            setMensaje({ texto: res.data.message, esError: false });
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMensaje({ 
                texto: err.response?.data?.error || 'Error al restablecer la contraseña', 
                esError: true 
            });
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                
                {/* PANEL IZQUIERDO: BRANDING (Igual al Login) */}
                <div 
                    className="brand-panel"
                    style={{
                        backgroundImage: `linear-gradient(135deg, rgba(11, 43, 61, 0.85), rgba(10, 31, 44, 0.95)), 
                        url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&auto=format&fit=crop')`
                    }}
                >
                    <div className="brand-content">
                        <div className="logo-area">
                            <div className="logo-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <span>Andorra<span className="logo-accent">❄️</span>Safe</span>
                        </div>
                        
                        <h1 className="brand-title">
                            Protege tu <span className="brand-highlight">cuenta</span><br />y vuelve a la nieve
                        </h1>
                        
                        <ul className="feature-list">
                            <li><i className="fas fa-shield-alt"></i> Conexión Encriptada</li>
                            <li><i className="fas fa-key"></i> Nueva Clave Segura</li>
                            <li><i className="fas fa-user-check"></i> Acceso Restaurado</li>
                        </ul>

                        <div className="location-tag" style={{ marginTop: 'auto' }}>
                            <i className="fas fa-mountain"></i> Estación Central de Seguridad
                        </div>
                    </div>
                </div>

                {/* PANEL DERECHO: FORMULARIO DE RESTABLECIMIENTO */}
                <div className="form-panel">
                    <div className="form-header">
                        <h2>Nueva Contraseña</h2>
                        <p><i className="fas fa-key"></i> Crea una clave que no olvides</p>
                    </div>

                    {mensaje.texto && (
                        <div style={{ 
                            backgroundColor: mensaje.esError ? '#fee2e2' : '#dcfce7', 
                            color: mensaje.esError ? '#dc2626' : '#15803d', 
                            padding: '12px', 
                            borderRadius: '12px', 
                            marginBottom: '20px', 
                            fontSize: '0.85rem', 
                            textAlign: 'center',
                            border: `1px solid ${mensaje.esError ? '#fecaca' : '#bbf7d0'}`
                        }}>
                            {mensaje.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Nueva Contraseña</label>
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirmar Contraseña</label>
                            <i className="fas fa-check-double input-icon"></i>
                            <input
                                type="password"
                                placeholder="Repite la contraseña"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-login" 
                            disabled={loading}
                        >
                            {loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                        </button>
                    </form>

                    <p className="signup-prompt">
                        ¿Recordaste tu contraseña? 
                        <Link to="/login">Volver al inicio</Link>
                    </p>

                    <button className="btn-back" onClick={() => navigate('/login')}>
                        <i className="fas fa-arrow-left"></i> Cancelar
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default RestablecerPassword;