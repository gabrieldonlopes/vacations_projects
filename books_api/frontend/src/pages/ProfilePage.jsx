import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import ListPreview from '../components/ListPreview.jsx';
import CreateListModal from "../components/CreateListModal.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { get_list_preview_for_user } from '../api/api_list.js';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [createdLists, setCreatedLists] = useState([]);
    const [savedLists, setSavedLists] = useState([]);
    const [savedBooks, setSavedBooks] = useState([]);

    // Função para buscar as listas do usuário
    const fetchLists = async () => {
        try {
            const response = await get_list_preview_for_user(user.user_id);
            setCreatedLists(response || []);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar listas:", error);
            setLoading(false);
        }
    };

    // Atualiza as listas quando o modal é fechado
    const refreshLists = () => {
        fetchLists();
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return null;
        } else {
            fetchLists();
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success("Logged out successfully");
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        refreshLists(); // Atualiza as listas após fechar o modal
    };

    // Função para lidar com a exclusão de uma lista
    const handleDeleteList = (listId) => {
        setCreatedLists(createdLists.filter(list => list.list_id !== listId)); // Remove a lista excluída do estado
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
    }

    return (
        <div className="min-h-screen py-10 px-6 relative">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-6xl mx-auto p-10 rounded-lg shadow-lg bg-gray-800">
                <div className="flex flex-col items-center md:flex-row md:items-start">
                    <div className="mb-6 md:mb-0 text-center">
                        <img
                            src={user.avatar || "./src/assets/owl.jpeg"}
                            alt={user.username || "User Avatar"}
                            className="w-40 h-40 object-cover rounded-full shadow-md"
                        />
                        <div className="flex justify-center mt-4 gap-6">
                            {/* Botões ou links adicionais podem ser adicionados aqui */}
                        </div>
                    </div>
                    <div className="md:ml-6 text-center md:text-left mt-4 md:mt-0">
                        <h1 className="text-3xl font-bold text-white mb-6">{user.username || "Usuário"}</h1>
                        <p className="text-xl text-gray-400 mb-4">
                            Email: {user.email || "Não informado"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400">
                            {/* Informações adicionais podem ser adicionadas aqui */}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex flex-row'>
                        <h2 className="text-2xl font-bold text-white mb-4">Listas Criadas</h2>
                        <div
                            className="cursor-pointer text-white py-2 px-4 rounded ml-auto hover:underline hover:underline-blue-500 transition-all duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal();
                            }}
                        >
                            Criar Lista
                        </div>
                    </div>
                    <hr className="opacity-50 mb-4" />
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                        {createdLists?.length > 0 ? (
                            createdLists.map((list) => (
                                <ListPreview
                                    key={list.list_id}
                                    list={list}
                                    onDelete={handleDeleteList} // Passa a função de callback
                                />
                            ))
                        ) : (
                            <p className="text-gray-400">Nenhuma lista criada.</p>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Listas Salvas</h2>
                    <hr className="opacity-50 mb-4" />
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                        {savedLists?.length > 0 ? (
                            savedLists.map((list) => (
                                <ListPreview key={list.list_id} list={list} />
                            ))
                        ) : (
                            <p className="text-gray-400">Nenhuma lista salva.</p>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Livros Salvos</h2>
                    <hr className="opacity-50 mb-4" />
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                        {savedBooks?.length > 0 ? (
                            savedBooks.map((book) => (
                                <BookPreview key={book.book_id} book={book} />
                            ))
                        ) : (
                            <p className="text-gray-400">Nenhum livro salvo.</p>
                        )}
                    </div>
                </div>

                <CreateListModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
                
                <div className="flex flex-col md:flex-row justify-center mt-8 text-center gap-6">
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Voltar
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;