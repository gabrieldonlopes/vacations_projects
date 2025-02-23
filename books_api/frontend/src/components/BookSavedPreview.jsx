import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookSavedPreview = ({ book }) => {
  const navigate = useNavigate();  // Para navegação

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);  // Redireciona para a página do livro
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => handleBookClick(book.id)}  // Navega ao clicar no livro
    >
      {book.volumeInfo_imageLinks_thumbnail ? (
        <img
          src={book.volumeInfo_imageLinks_thumbnail}
          alt={book.volumeInfo_title}
          className="w-32 h-48 object-cover rounded-lg transition-opacity hover:opacity-75"
        />
      ) : (
        <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
          Sem imagem
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
        <h3 className="text-lg font-bold text-white text-center">
          {book.volumeInfo_title}
        </h3>
        <p className="text-sm text-gray-300 text-center">
          {book.volumeInfo_authors ? book.volumeInfo_authors.join(', ') : 'Autor desconhecido'}
        </p>
      </div>
    </div>
  );
};

export default BookSavedPreview;