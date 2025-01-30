import React, { useState } from 'react';

const BookPreview = ({ books }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="w-full max-w-5xl p-6 mt-4 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Resultados da Pesquisa</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentBooks.map((book) => (
          <div key={book.id} className="border border-gray-300 rounded-lg p-4 shadow-lg flex flex-col items-center transition-transform hover:scale-105">
            {/* Capa */}
            {book.volumeInfo_imageLinks_thumbnail ? (
              <img
                src={book.volumeInfo_imageLinks_thumbnail}
                alt={book.volumeInfo_title}
                className="w-32 h-48 object-cover mb-2 rounded-lg"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                Sem imagem
              </div>
            )}

            {/* Título e autor */}
            <h3 className="text-lg font-bold text-center">{book.volumeInfo_title}</h3>
            <p className="text-sm text-gray-700">
              {book.volumeInfo_authors ? book.volumeInfo_authors.join(', ') : 'Autor desconhecido'}
            </p>

            {/* Extras */}
            <p className="text-xs text-gray-500">{book.volumeInfo_pageCount} páginas</p>
            <p className="text-xs text-gray-500">Idioma: {book.volumeInfo_language.toUpperCase()}</p>
            {book.volumeInfo_averageRating !== null && (
              <p className="text-xs text-yellow-500">⭐ {book.volumeInfo_averageRating}/5</p>
            )}
          </div>
        ))}
      </div>

      {/* Paginação */}
      {books.length > booksPerPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mr-2 border rounded-lg text-blue-500 hover:bg-gray-200"
          >
            Anterior
          </button>
          <span className="px-4 py-2">{currentPage} / {Math.ceil(books.length / booksPerPage)}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastBook >= books.length}
            className="px-4 py-2 ml-2 border rounded-lg text-blue-500 hover:bg-gray-200"
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
};

export default BookPreview;
