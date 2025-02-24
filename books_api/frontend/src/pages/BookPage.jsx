import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { get_book } from '../api/api_book.js';
import { get_list_preview_for_user,add_book_to_list, get_list_preview_for_book } from '../api/api_list.js';
import Modal from "react-modal";
import { AuthContext,AuthProvider } from '../contexts/AuthContext.jsx';
import { toast } from "react-toastify";
import Header from '../components/Header.jsx';

Modal.setAppElement('#root'); // Substitua '#root' pelo ID do elemento raiz do seu app

const ListSelectionModal = ({ isOpen, onClose, bookData }) => {
    const [lists, setLists] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const data = await get_list_preview_for_user(user.user_id);
                setLists(data);
            } catch (error) {
                console.error("Erro ao carregar listas:", error);
            }
        };
        fetchLists();
    }, [user.user_id]);

    const handleAddBookToList = async (list_id) => {
        try {
            await add_book_to_list(list_id, bookData);
            onClose(); // Fecha o modal após adicionar o livro
        } catch (error) {
            toast.error("Erro ao adicionar livro à lista:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Selecione uma Lista"
            className="modal-content bg-gray-500 rounded-lg shadow-xl p-6 mx-4 w-full max-w-md relative"
            overlayClassName="modal-overlay fixed inset-0 bg-opacity-75 flex items-center justify-center p-4"
            closeTimeoutMS={200} // Tempo para fechar o modal (em milissegundos)
        >
            {/* Botão de fechar */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Selecione uma Lista</h2>

            <ul className="space-y-4">
                {lists.map((list) => (
                    <li
                        key={list.list_id}
                        onClick={() => handleAddBookToList(list.list_id)}
                        className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                        <p className="text-lg font-medium text-white">{list.name}</p>
                        <p className="text-sm text-gray-400">{list.description || "Sem descrição"}</p>
                    </li>
                ))}
            </ul>
        </Modal>
    );
};
const BookPage = () => {
    const { book_id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isListSelectionModalOpen, setListSelectionModalOpen] = useState(false);

    const bookData = {
        book_id: String(book?.id || ""),
        book_title: book?.title || "",
        book_thumbnail: book?.volumeInfo?.imageLinks?.large || "",
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await get_book(book_id);
                setBook(data);
            } catch (error) {
                console.error("Erro ao carregar livro:", error);
            } finally {
                setLoading(false);
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
        );
    }

    if (!book) {
        return <div className="text-center text-2xl text-gray-700">Livro não encontrado.</div>;
    }

    return (
        <div className="min-h-screen py-30 px-6">
            <Header />
            <div className="max-w-6xl bg-gray-800 mx-auto p-8 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <img
                            src={book.imageLinks_large}
                            alt={book.title}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                        <button
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            onClick={() => setListSelectionModalOpen(true)}
                        >
                            Adicionar a lista
                        </button>
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

            <ListSelectionModal
                isOpen={isListSelectionModalOpen}
                onClose={() => setListSelectionModalOpen(false)}
                bookData={bookData}
            />
        </div>
    );
};

export default BookPage;