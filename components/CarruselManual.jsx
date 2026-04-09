import { useState } from 'react';
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

const CarruselManual = ({ imagenes }) => {
  const [indice, setIndice] = useState(0);
  const URL_BASE = "http://localhost:3000";

  // Nos aseguramos de tener un array de strings (rutas de imagen)
  const fotos = Array.isArray(imagenes) ? imagenes.filter(img => img) : [];

  const siguiente = () => {
    setIndice((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const anterior = () => {
    setIndice((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  if (fotos.length === 0) {
    return (
      <div style={{ width: '100%', height: '450px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Sin imágenes disponibles</p>
      </div>
    );
  }

  // Estilo común para los botones
  const btnStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 10,
    transition: 'all 0.2s ease'
  };

  return (
    <div className="carrusel-contenedor" style={{ position: 'relative', width: '100%', height: '450px', overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
      
      {/* Imagen actual con animación suave */}
      <img
        key={indice}
        src={fotos[indice].startsWith('http') ? fotos[indice] : `${URL_BASE}${fotos[indice]}`}
        alt={`Imagen ${indice + 1}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          animation: 'fadeIn 0.5s ease-in-out'
        }}
        onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1551882547-ff43c639f675';
        }}
      />

      {/* Controles de navegación */}
      {fotos.length > 1 && (
        <>
          <button 
            onClick={anterior} 
            style={{ ...btnStyle, left: '15px' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
          >
            <LuArrowLeft size={20} color="#0f172a" />
          </button>

          <button 
            onClick={siguiente} 
            style={{ ...btnStyle, right: '15px' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
          >
            <LuArrowRight size={20} color="#0f172a" />
          </button>

          {/* Indicadores (bolitas inferiores) */}
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px',
            zIndex: 11
          }}>
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndice(i)}
                style={{
                  width: i === indice ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '10px',
                  border: 'none',
                  background: i === indice ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Estilos CSS Inline para la animación de entrada */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0.8; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CarruselManual;