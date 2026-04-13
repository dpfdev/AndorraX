import axios from 'axios';

const api = axios.create({
    // Prioriza la variable de entorno, si no existe usa el localhost
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : 'http://localhost:3000/api'
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;