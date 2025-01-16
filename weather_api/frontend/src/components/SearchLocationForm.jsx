import React, { useState } from 'react';
import WeatherLocation from './WeatherLocation';

const SearchLocationForm = ({ setShowHeader }) => {
  const [location, setLocation] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState(null);

  const handleForm = (event) => {
    event.preventDefault(); // Evita o reload da página
    setSubmittedLocation(location); // Salva a localidade submetida
    setShowHeader(false); // Oculta o h1 no App.jsx
  };

  return (
    <div>
      <form onSubmit={handleForm}>
        <input
          type="text"
          placeholder="Localidade"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Atualiza o estado do Localidade
          className="mt-10 mb-10 flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Buscar
        </button>
      </form>

      {/* Exibe o componente WeatherLocation apenas após submissão */}
      {submittedLocation && <WeatherLocation location={submittedLocation} />}
    </div>
  );
};

export default SearchLocationForm;
