import React, { useState } from 'react';
  
const SearchBook = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [location, setLocation] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState(null);

  const handleForm = (event) => {
    event.preventDefault(); // Evita o reload da página
    setSubmittedLocation(location); // Salva a livro submetido
    setShowHeader(false); // Oculta o h1 no App.jsx
  };
  return (
    <div className="min-h-screen flex items-center justify-center "> {/* Flex para centralizar */}
      <div className="w-fullp-6 text-center"> {/* Limita largura, aplica padding e centraliza conteúdo */}
        {showHeader && <h1 className="text-4xl font-bold mb-8">Pesquise pelo Livro ou Autor que deseja ler</h1>}
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

      </div>
      </div>
    </div>
  );
};

export default SearchBook;