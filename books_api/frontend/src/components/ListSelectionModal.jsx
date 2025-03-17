import React, { useState, useEffect, useContext } from 'react';
import { get_list_preview_for_user, add_book_to_list } from '../api/api_list.js';
import Modal from "react-modal";
import { AuthContext } from '../contexts/AuthContext.jsx';
import { toast } from "react-toastify";
import { ClipLoader } from 'react-spinners'; // Para o spinner de carregamento

Modal.setAppElement('#root'); 

const ListSelectionModal = ({ isOpen, onClose, bookData,token, onAddBookToList }) => {
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const data = await get_list_preview_for_user(user.user_id);
                setLists(data);
            } catch (error) {
                console.error("Erro ao carregar listas:", error);
                toast.error("Erro ao carregar listas.");
            }
        };
        fetchLists();
    }, [user.user_id]);

    const handleAddBookToList = async (list_id) => {
        setIsLoading(true); // Ativa o estado de carregamento
        try {
            await add_book_to_list(list_id, bookData,token);
            toast.success("Livro adicionado com sucesso!");
            onAddBookToList(); // Notifica o componente pai para atualizar as listas
            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao adicionar livro à lista:", error);
            toast.error("Erro ao adicionar livro à lista.");
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Selecione uma Lista"
            className="modal-content bg-gray-800 rounded-lg shadow-xl p-6 mx-4 w-full max-w-md relative"
            overlayClassName="modal-overlay fixed inset-0 bg-opacity-75 flex items-center justify-center p-4"
            closeTimeoutMS={200}
        >
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
                {lists.length > 0 ? (
                    lists.map((list) => (
                        <li
                            key={list.list_id}
                            onClick={() => handleAddBookToList(list.list_id)}
                            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                        >
                            <p className="text-lg font-medium text-white">{list.name}</p>
                            <p className="text-sm text-gray-300">
                                {list.description && list.description.length > 40 ? `${list.description.slice(0, 40)}...`
                                : list.description || "Sem descrição"}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-400 text-center">Nenhuma lista disponível.</p>
                )}
            </ul>

            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <ClipLoader color="#3B82F6" size={40} />
                </div>
            )}
        </Modal>
    );
};

export default ListSelectionModal;