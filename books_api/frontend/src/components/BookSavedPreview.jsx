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
      onClick={() => handleBookClick(book.book_id)}  // Navega ao clicar no livro
    >
      {book.book_thumbnail ? (
        <img
          src={book.book_thumbnail}
          alt={book.book_title}
          className="w-full h-fullobject-cover rounded-lg transition-opacity hover:opacity-75"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
          Sem imagem
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-95 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
        <h3 className="text-lg font-bold text-white text-center">
          {book.book_title}
        </h3>
      </div>
    </div>
  );
};

export default BookSavedPreview;