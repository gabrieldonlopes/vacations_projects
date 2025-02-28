import React, { useState, useContext } from 'react';  
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { search_book } from '../api/api_book.js';
import BookPreview from '../components/BookPreview';
import Header from '../components/Header';
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para mostrar carregamento

//TODO : ADICIONAR TRATAMENTO DE EXCEÇÃO PARA HTTP EXCEPTION 500
  const handleForm = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true); // Ativa carregamento
    try {
      const response = await search_book(searchTerm);
      setSearchResults(response);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
    setLoading(false); // Desativa carregamento
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />


      <div className="flex flex-col justify-center items-center flex-grow text-center px-6">
        <h1 className="text-4xl font-bold mb-6">Pesquise pelo Livro ou Autor que deseja ler</h1>
        
        <form onSubmit={handleForm} className="w-full max-w-lg relative">
          <input
            type="text"
            placeholder="Digite o nome do livro ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && searchResults.length > 0 && <BookPreview books={searchResults} />}
    </div>
  );
};

export default SearchPage;
