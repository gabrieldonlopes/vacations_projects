import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get_book } from '../api/api_book.js';
import ListSelectionModal from '../components/ListSelectionModal.jsx';
import ListPreview from '../components/ListPreview.jsx';
import { toast } from "react-toastify";
import Header from '../components/Header.jsx';
import { get_list_preview_for_book } from '../api/api_list.js';

const BookPage = () => {
    const { book_id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isListSelectionModalOpen, setListSelectionModalOpen] = useState(false);
    const [bookLists, setBookLists] = useState([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Estado para controlar a descrição

    const bookData = {
        book_id: String(book?.id || ""),
        book_title: book?.title || "",
        book_thumbnail: book?.imageLinks_large || "",
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigate('/');
        }
    };

    // Função para buscar as listas do livro
    const fetchLists = async () => {
        try {
            const data = await get_list_preview_for_book(book_id);
            setBookLists(data);
        } catch (error) {
            console.error("Erro ao carregar listas:", error);
        }
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await get_book(book_id);
                setBook(data);
            } catch (error) {
                toast.error("Erro ao carregar livro:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
        fetchLists(); // Busca as listas ao carregar a página
    }, [book_id]);

    // Função para atualizar as listas após adicionar o livro
    const handleAddBookToList = async () => {
        await fetchLists(); // Atualiza as listas exibidas  
        setListSelectionModalOpen(false); // Fecha o modal
    };
    const handleDeleteList = (listId) => {
        setBookLists(bookLists.filter(list => list.list_id !== listId)); // Remove a lista excluída do estado
    };
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full" role="status">
                    </div>
                    <p className="text-2xl font-semibold mt-4 text-white">Carregando informações do livro...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return <div className="min-h-screen flex justify-center items-center bg-gray-900 text-2xl text-gray-400">Livro não encontrado.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-30 px-4 sm:px-6 lg:px-8">
            <Header />
            <div className="max-w-7xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
                <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-8">
                    <div className="md:w-1/3 w-full">
                        <img
                            src={book.imageLinks_large}
                            alt={book.title}
                            className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        />
                        <button
                            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            onClick={() => setListSelectionModalOpen(true)}
                        >
                            Adicionar à Lista
                        </button>
                    </div>

                    <div className="md:w-2/3 w-full">
                        <h1 className="text-4xl font-bold text-white mb-4">{book.title}</h1>
                        <p className="text-xl text-gray-400 mb-6">Por: {book.authors.join(', ')}</p>
                        <div className="mb-8">
                            <p className={`text-lg text-gray-300 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                                {book.description}
                            </p>
                            <button
                                className="text-blue-500 hover:text-blue-400 mt-2 focus:outline-none"
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            >
                                {isDescriptionExpanded ? "Ver menos" : "Ver mais"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400">
                            <p><strong className="text-white">Editor:</strong> {book.publisher}</p>
                            <p><strong className="text-white">Data de Publicação:</strong> {book.publishedDate}</p>
                            <p><strong className="text-white">Páginas:</strong> {book.pageCount}</p>
                            <p><strong className="text-white">Gêneros:</strong> {book.categories?.join(', ') || 'Não especificado'}</p>
                            <p><strong className="text-white">Idioma:</strong> {book.language}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Listas com esse Livro</h2>
                    <hr className="border-gray-700 mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bookLists?.length > 0 ? (
                            bookLists.map((list) => (
                                <ListPreview key={list.list_id} list={list} onDelete={handleDeleteList}  />
                            ))
                        ) : (
                            <p className="text-gray-400">Nenhuma lista encontrada.</p>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={handleBack}
                        className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Voltar
                    </button>
                </div>
            </div>

            <ListSelectionModal
                isOpen={isListSelectionModalOpen}
                onClose={() => setListSelectionModalOpen(false)}
                bookData={bookData}
                onAddBookToList={handleAddBookToList} // Passa a função para atualizar as listas
            />
        </div>
    );
};

export default BookPage;