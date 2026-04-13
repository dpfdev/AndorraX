import { Lock, Mail, Snowflake, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../src/services/api';
import './Registro.css';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // RUTA CORREGIDA: Debe coincidir con el router del backend (/api/auth/registrar)
            await api.post('/auth/registrar', formData);
            
            alert("NODO_CREADO: Identidad registrada con éxito.");
            navigate('/login');
        } catch (err) {
            console.error("Error de Registro:", err.response?.data);
            const msg = err.response?.data?.error || "No se pudo completar el registro.";
            alert(`ERROR_DE_SISTEMA: ${msg}`);
        }
    };

    return (
        <div className="auth-page-snow">
            <div className="auth-card-mini">
                <div className="snow-header">
                    <Snowflake className="icon-freeze" size={20} />
                    <span className="station-id">NEW_IDENTITY: ARC-02</span>
                    <h1>REGISTRO</h1>
                </div>

                <form className="snow-form" onSubmit={handleSubmit}>
                    <div className="input-snow-group">
                        <label><User size={12} /> NOMBRE_COMPLETO</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            required 
                        />
                    </div>

                    <div className="input-snow-group">
                        <label><Mail size={12} /> EMAIL_ID</label>
                        <input 
                            type="email" 
                            placeholder="user@arctic.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>

                    <div className="input-snow-group">
                        <label><Lock size={12} /> PASSWORD</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-freeze">
                        <UserPlus size={16} />
                        <span>CREAR_IDENTIDAD</span>
                    </button>
                </form>

                <div className="snow-footer">
                    <Link to="/login" className="link-snow">
                        ¿YA TIENES CUENTA? LOGIN
                    </Link>
                </div>
            </div>
            <div className="snow-overlay"></div>
        </div>
    );
};

export default Registro;