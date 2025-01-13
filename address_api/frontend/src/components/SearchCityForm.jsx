import React, { useState } from 'react';
import City from './City.jsx';

const SearchCityForm = () => {
  const [cep, setCep] = useState('');
  const [submittedCep, setSubmittedCep] = useState(null);

  const handleForm = (event) => {
    event.preventDefault(); // Evita o reload da página
    setSubmittedCep(cep);  // Salva o CEP submetido
  };

  return (
    <div>
      <form onSubmit={handleForm}>
        <input
          type="text"
          placeholder="CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)} // Atualiza o estado do CEP
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Exibe o componente City apenas após submissão */}
      {submittedCep && <City cep={submittedCep} />}
    </div>
  );
};

export default SearchCityForm;
