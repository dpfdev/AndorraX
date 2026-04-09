import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const loggedUser = localStorage.getItem('usuario'); 
      if (loggedUser) {
        setUser(JSON.parse(loggedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/');
    window.location.reload(); 
  };

  return (
    <nav className="main-nav">
      {/* Añadimos un margen derecho al logo para separarlo de los links */}
      <div className="nav-logo" style={{ marginRight: '60px' }}>
        <Link to="/" style={{textDecoration: 'none'}}>ANDORRA<span>X</span></Link>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '25px' }}>
        <Link to="/">Inicio</Link>
        <Link to="/hoteles">Hoteles</Link>
        <Link to="/actividades">Actividades</Link>
        <Link to="/eventos">Eventos</Link>
        
        {user ? (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '25px' }}>
            
            <span style={{ 
                color: '#cbd5e1', 
                fontWeight: '600', 
                fontSize: '0.9rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
              Hola, <span style={{ color: 'white' }}>{user.nombre}</span>
            </span>

            <Link to="/mis-reservas">Mis Reservas</Link>
            
            {user.rol === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--ski-orange)' }}>Admin</Link>
            )}

            <button 
              onClick={handleLogout} 
              style={{ 
                background: 'var(--ski-orange)', 
                color: 'white', 
                border: 'none', 
                padding: '6px 15px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                textTransform: 'uppercase'
              }}
            >
              Salir
            </button>
          </div>
        ) : (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
            <Link to="/login">Entrar</Link>
            <Link to="/registro">Registro</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;