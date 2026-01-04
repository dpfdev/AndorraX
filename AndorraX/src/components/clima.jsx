// ...existing code...
import { useEffect, useState } from 'react';
import './App.css';

const apiKey = '9f5b8c1c59cce347e4af305a836d872b'; // Reemplaza por tu propia API key si quieres
const cities = ['Andorra la Vella', 'Soldeu', 'El Tarter', 'Canillo', 'Arinsal', 'Escaldes-Engordany', 'La Massana', 'Ordino'];

function Clima() {
  const [city, setCity] = useState(cities[0]); // Andorra la Vella por defecto
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
          main: { temp: data.main.temp, humidity: data.main.humidity },
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
    <main className="app">
      <header className="app-header">
        <h1>Clima de Andorra</h1>
        <p className="subtitle">Selecciona un pueblo </p>
      </header>

      <section className="controls">
        <label htmlFor="citySelect" className="visually-hidden">Ciudad</label>
        <select id="citySelect" value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      <section className="weather-card" aria-live="polite">
        {error && <p style={{ color: '#ffb4b4' }}>Error: {error}</p>}

        {!error && !weather && !loading && <p>Cargando datos del clima...</p>}

        {weather && (
          <>
            <h2>Clima en {weather.name}</h2>
            <p className="temp">{Math.round(weather.main.temp)} °C</p>
            <p>Descripción: {weather.weather[0]?.description}</p>
            <div className="meta">
              <div className="item">Humedad: {weather.main.humidity}%</div>
              <div className="item">Viento: {weather.wind.speed} m/s</div>
            </div>
          </>
        )}

        {loading && <div className="loader" aria-hidden="true" />}
      </section>
    </main>
  );
}

export default Clima;
// ...existing code...