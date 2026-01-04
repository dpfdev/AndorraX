// ...existing code...
import { useEffect, useState } from 'react';
import '../App.css';

const apiKey = '9f5b8c1c59cce347e4af305a836d872b'; // Reemplaza por tu propia API key si quieres
const cities = ['Andorra la Vella', 'Soldeu', 'El Tarter', 'Canillo', 'Arinsal', 'Escaldes-Engordany', 'La Massana', 'Ordino'];


function Clima() {
  const [city, setCity] = useState(cities[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (ciudad) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Error al obtener el clima');
      } else {
        setWeather({
          name: data.name,
          main: {
            temp: data.main.temp,
            humidity: data.main.humidity,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            feels_like: data.main.feels_like,
            pressure: data.main.pressure
          },
          weather: data.weather,
          wind: { speed: data.wind.speed },
        });
      }
    } catch (e) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <div className="clima-list-container">
      <h2 className="clima-list-title">Clima de Andorra</h2>
      <div className="clima-select-bar">
        <label htmlFor="citySelect" className="visually-hidden">Ciudad</label>
        <select
          id="citySelect"
          className="clima-select"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="clima-list-grid">
        <div className="card-example clima-card">
          <div className="card-example-body">
            <h3 className="clima-card-title">{weather?.name || city}</h3>
            {error ? (
              <p className="clima-error">{error}</p>
            ) : loading || !weather ? (
              <div className="loader" aria-hidden="true" />
            ) : (
              <div className="weather-card" aria-live="polite">
                <div className="clima-row">
                  <div className="clima-col clima-condicion">
                    <div className="clima-label">Condición</div>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon || '01d'}@2x.png`}
                      alt={weather.weather[0]?.description}
                      className="clima-icon"
                    />
                    <span className="clima-desc">{weather.weather[0]?.description}</span>
                  </div>
                  <div className="clima-col clima-temp">
                    <div className="clima-label">Temperatura</div>
                    <div className="clima-temp-main">{Math.round(weather.main.temp)}<span>°C</span></div>
                    <div className="clima-temp-det"><span>🌡️</span> Sensación: <b>{Math.round(weather.main.feels_like)}°C</b></div>
                    <div className="clima-temp-det"><span>🔻</span> Mín: <b>{Math.round(weather.main.temp_min)}°C</b></div>
                    <div className="clima-temp-det"><span>🔺</span> Máx: <b>{Math.round(weather.main.temp_max)}°C</b></div>
                  </div>
                  <div className="clima-col clima-valores">
                    <div className="clima-label">Valores</div>
                    <div className="clima-valor"><span>💧</span> <b>{weather.main.humidity}%</b> Humedad</div>
                    <div className="clima-valor"><span>💨</span> <b>{weather.wind.speed} m/s</b> Viento</div>
                    <div className="clima-valor"><span>🧭</span> <b>{weather.main.pressure} hPa</b> Presión</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clima;
// ...existing code...