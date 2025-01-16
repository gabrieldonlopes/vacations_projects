import api from "../api.js";
import React, { useState, useEffect } from "react";
import DayWeather from "./DayWeather.jsx";
import WeatherChart from "./WeatherChart.jsx";
const getDay = (date) => {
    const day = date.split(' '); 
    const diasDaSemana = ['Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const dia = diasDaSemana[new Date(day[0]).getDay()];
    return dia.concat(' ', day[1]);
    }

const WeatherLocation = ({ location }) => {
  const [weather, setWeatherData] = useState(null);
  const [error, setError] = useState(null); // usado para exibir erros
  

  const getWeather = async () => {
    try {
      const response = await api.get(`/weather/${location}`);
      setWeatherData(response.data);
      setError(null); 
    } catch (err) {
      setError("Erro ao buscar informações da cidade");
      console.error(err);
    }
  };
  const avgTemp = (day_maxtemp_c, day_mintemp_c) => {
    return (day_maxtemp_c + day_mintemp_c) / 2;
  }


  useEffect(() => {
    if (location) {
        getWeather();
    }
  }, [location]); 

// possíveis erros
  if (error) {
    return <div style={{ color: "red", marginTop: "20px" }}>{error}</div>;
  }

  if (!weather) {
    return <div style={{ marginTop: "20px" }}>Carregando...</div>;
  }
  return (
    
<div className="main-container p-4">
    {/* Informações da localização */}
    <div className="location-info mb-4">
      <p className="text-lg font-medium">
          Resultados para <b>{weather.name}</b>, {weather.region} - {weather.country} ({weather.lat}, {weather.lon})
      </p>
    </div>

    {/* Dados do clima atual */}
    <div className="current-weather flex shrink-0 items-center bg-gray-800 text-white rounded-lg p-6 ">
      <div className="flex items-center space-x-2">
        <img src={weather.condition_icon} alt="Weather Icon" className="h-16 w-16" />
        <span className="text-4xl font-bold">{weather.temp_c}°C</span>
    </div>
      <div className="text-sm ml-40 justify-items-end text-gray-300 space-y-1">
        <p>Precipitação: {weather.precip_mm} mm</p>
        <p>Humidade: {weather.humidity}%</p>
        <p>Velocidade do vento: {weather.wind_kph} km/h</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-lg">{getDay(weather.localtime)}</p>
        <p className="text-gray-400">{weather.condition_text}</p>
      </div>
  </div>

  {/* Gráfico */}
  
  {/* TODO: implementar gráfico de maneira mais interativa e orgânica */}

  <WeatherChart days={weather.forecasts.map((forecast) => getDay(forecast.date).slice(0,3))} avgTemp={weather.forecasts.map((forecast) => avgTemp(forecast.day_maxtemp_c, forecast.day_mintemp_c))} />


  <div className="forecast mt-6 grid grid-cols-7 gap-4">
    {weather.forecasts.map((forecast, index) => (
    <DayWeather
      key={index}
      day_date={getDay(forecast.date)}
      day_maxtemp_c={forecast.day_maxtemp_c}
      day_mintemp_c={forecast.day_mintemp_c}
      day_condition_icon={forecast.day_condition_icon}
      />
    ))}
  </div>
</div>
  );
}



export default WeatherLocation;
