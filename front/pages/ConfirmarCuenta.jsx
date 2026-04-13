import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../src/services/api';

const ConfirmarCuenta = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('procesando'); 
    const [mensaje, setMensaje] = useState('Verificando tu identidad...');
    
    // El "candado" para evitar doble ejecución
    const peticionRealizada = useRef(false);

    useEffect(() => {
        // Si ya se hizo la petición una vez en este ciclo de vida, no hagas nada
        if (peticionRealizada.current) return;

        const activarCuenta = async () => {
            peticionRealizada.current = true; // Cerramos el candado inmediatamente
            
            try {
                const response = await api.get(`/auth/confirmar/${token}`);
                setStatus('exito');
                setMensaje(response.data.message);
                
                // Redirigir al login después de 3 segundos
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                // Si el error es porque ya se confirmó (token es NULL), podrías manejarlo aquí
                // Pero por ahora, solo mostramos el error si realmente falló
                setStatus('error');
                setMensaje(err.response?.data?.error || 'Error al activar la cuenta.');
            }
        };

        activarCuenta();
    }, [token, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <div style={{ padding: '30px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '10px', textAlign: 'center' }}>
                {status === 'procesando' && <h2 style={{ color: '#64748b' }}>⏳ {mensaje}</h2>}
                {status === 'exito' && <h2 style={{ color: '#10b981' }}>✅ {mensaje}</h2>}
                {status === 'error' && <h2 style={{ color: '#ef4444' }}>❌ {mensaje}</h2>}
                
                {status === 'exito' && <p>¡Perfecto! Redirigiendo al login...</p>}
                {status === 'error' && <p>Verifica si tu cuenta ya estaba activa o solicita un nuevo enlace.</p>}
            </div>
        </div>
    );
};

export default ConfirmarCuenta;