import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get_list, add_book_to_list, remove_book_from_list } from "../api/api_list";
import { get_user_by_id } from "../api/api_auth";
import { AuthContext } from "../contexts/AuthContext";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Header from "../components/Header";
import "react-toastify/dist/ReactToastify.css";

const ListPage = () => {
    const { list_id } = useParams();
    const [list, setList] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Modal.setAppElement("#root"); // Configuração do Modal

        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                const listData = await get_list(list_id, { signal: abortController.signal });
                setList(listData);

                if (listData) {
                    const userData = await get_user_by_id(listData.owner_user_id, { signal: abortController.signal });
                    setUser(userData);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Erro ao carregar os dados:", error);
                    toast.error("Erro ao carregar a lista. Tente novamente mais tarde.");
                    setError("Erro ao carregar a lista.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, [list_id]);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleRemoveBook = async (bookId) => {
        try {
            await remove_book_from_list(list_id, bookId);
            const updatedList = await get_list(list_id);
            setList(updatedList);
            toast.success("Livro removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover livro:", error);
            toast.error("Erro ao remover livro.");
        }
    };

    const openModal = (book) => {
        setSelectedBook(book);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedBook(null);
        setModalOpen(false);
    };

    const confirmRemoveBook = async () => {
        if (selectedBook) {
            await handleRemoveBook(selectedBook.book_id);
        }
        closeModal();
    };

    if (loading) {''
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full" role="status"></div>
                    <p className="text-2xl font-semibold mt-4">Carregando informações da lista...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-2xl text-red-600">{error}</div>;
    }

    if (!list) {
        return <div className="text-center text-2xl text-gray-700">Lista não encontrada.</div>;
    }

    return (
        <div className="min-h-screen py-30 px-6">
            <Header />
            <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg bg-gray-800">
                <h1 className="text-3xl font-bold mb-4 text-white">{list.name}</h1>
                <p className="text-gray-400 mb-4">{list.description}</p>
                <p className="text-gray-400 mb-4">Criada por: {user ? user.username : "Usuário desconhecido"}</p>

                <div className="flex gap-4 mb-6">
                    <p className="text-gray-300">
                        <span className="font-semibold">Likes:</span> {list.likes || 0}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Visibilidade:</span> {list.visibility ? "Pública" : "Privada"}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {Array.isArray(list.books) && list.books.length > 0 ? (
                        list.books.map((book) => (
                            <div
                                key={book.book_id}
                                onClick={() => handleBookClick(book.book_id)}
                                className="relative bg-gray-700 p-4 rounded-lg shadow-lg cursor-pointer group"
                            >
                                {user?.user_id === list.owner_user_id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(book);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        ✕
                                    </button>
                                )}

                                <img
                                    src={book.book_thumbnail}
                                    alt={book.book_title}
                                    className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
                                />
                                <p className="text-white text-sm mt-2 text-center">{book.book_title}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-2xl text-gray-700 col-span-full">
                            A lista ainda não possui nenhum livro.
                        </p>
                    )}
                </div>

                {/* Modal de Confirmação */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Confirmar Remoção"
                    className="modal-content bg-gray-700 p-6 rounded-lg shadow-lg max-w-md mx-auto text-center"
                    overlayClassName="modal-overlay fixed inset-0 bg-opacity-75 flex items-center justify-center"
                >
                    <h2 className="text-xl font-bold text-white mb-4">Remover Livro?</h2>
                    <p className="text-gray-300 mb-6">Tem certeza de que deseja remover "{selectedBook?.book_title}" da lista?</p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={confirmRemoveBook}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Remover
                        </button>
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </Modal>
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

export default ListPage;
