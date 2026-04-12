import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import './MapaLocalizacion.css';

// Coordenadas de Andorra por defecto
const position = [42.5063, 1.5218];

const MapaLocalizacion = () => {
  return (
    <div className="map-container-cyber">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
        {/* Usamos un diseño de mapa oscuro/técnico */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>
            <span className="popup-tech">ESTACIÓN_CENTRAL_ANDORRA</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapaLocalizacion;