import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/login.css';
import api from '../services/api';

const AndorraLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            
            // Guardamos token y el objeto usuario completo
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user)); 
            
            navigate('/');
            window.location.reload(); // Forzamos recarga para que el Navbar lea los datos
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <form className="form-panel" onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>
                    {error && <p className="error-msg">{error}</p>}
                    <div className="input-group-login">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group-login">
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-login-submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default AndorraLogin;