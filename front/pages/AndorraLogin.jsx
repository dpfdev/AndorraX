import { Lock, LogIn, Mail, Snowflake } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AndorraLogin.css';

const AndorraLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            alert("ERROR_DE_CONEXIÓN: Credenciales no reconocidas.");
        }
    };

    return (
        <div className="auth-page-snow">
            <div className="auth-card-mini">
                <div className="snow-header">
                    <Snowflake className="icon-freeze" size={20} />
                    <span className="station-id">STATION_ID: AND-01</span>
                    <h1>LOGIN</h1>
                </div>

                <form className="snow-form" onSubmit={handleSubmit}>
                    <div className="input-snow-group">
                        <label><Mail size={12} /> EMAIL</label>
                        <input 
                            type="email" 
                            placeholder="user@arctic.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="input-snow-group">
                        <label><Lock size={12} /> PASSWORD</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-freeze">
                        <LogIn size={16} />
                        <span>CONECTAR</span>
                    </button>
                </form>

                <div className="snow-footer">
                    <Link to="/registro" className="link-snow">
                        ¿CREAR CUENTA?
                    </Link>
                </div>
            </div>
            {/* Capa de partículas de nieve */}
            <div className="snow-overlay"></div>
        </div>
    );
};

export default AndorraLogin;