import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get_book } from '../api.js';

const BookPage = () => {
    const { book_id } = useParams();  // Obtém o book_id da URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);  // Estado de carregamento

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await get_book(book_id);
                setBook(data);
            } catch (error) {
                console.error("Erro ao carregar livro:", error);
            } finally {
                setLoading(false);  // Fim do carregamento
            }
        };

        fetchBook();
    }, [book_id]);
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full" role="status">
                    </div>
                    <p className="text-2xl font-semibold mt-4">Carregando informações do livro...</p>
                </div>
            </div>
        );  // Exibe o spinner e texto de carregamento
    }

    if (!book) {
        return <div className="text-center text-2xl text-gray-700">Livro não encontrado.</div>;  // Caso não consiga carregar o livro
    }

    return (
        <div className="min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <img
                            src={book.imageLinks_large}
                            alt={book.title}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                    </div>

                    <div className="md:w-2/3 md:ml-8">
                        <h1 className="text-4xl font-bold text-white mb-6">{book.title}</h1>
                        <p className="text-xl text-gray-400 mb-4">Por: {book.authors.join(', ')}</p>
                        <p className="text-lg text-gray-300 mb-6">{book.description || 'Descrição não disponível.'}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400">
                            <p><strong className="text-white">Editor:</strong> {book.publisher}</p>
                            <p><strong className="text-white">Data de Publicação:</strong> {book.publishedDate}</p>
                            <p><strong className="text-white">Páginas:</strong> {book.pageCount}</p>
                            <p><strong className="text-white">Gêneros:</strong> {book.categories?.join(', ') || 'Não especificado'}</p>
                            <p><strong className="text-white">Idioma:</strong> {book.language}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookPage;
