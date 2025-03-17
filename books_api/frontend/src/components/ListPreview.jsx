import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import { toast } from "react-toastify";
import { delete_list } from "../api/api_list";
import { AuthContext } from '../contexts/AuthContext.jsx';

const ListPreview = ({ list, onDelete }) => {
    const { token,user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedList, setSelectedList] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    if (!list) {
        return <p className="text-gray-400">Lista inválida.</p>;
    }

    const thumbnail = list.thumbnail || [];

    const handleListClick = (event, list_id) => {
        // Verifica se o clique foi no botão de exclusão ou no modal
        if (event.target.closest('button') || event.target.closest('.modal-content')) {
            return; // Não faz nada se o clique foi no botão de exclusão ou no modal
        }

        if (event.button === 1 || event.ctrlKey || event.metaKey) {
            window.open(`/list/${list_id}`, '_blank');
        } else {
            navigate(`/list/${list_id}`);
        }
    };

    const openModal = (list) => {
        setSelectedList(list);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedList(null);
        setModalOpen(false);
    };

    const confirmDeleteList = async () => {
        try {
            await delete_list(selectedList.list_id, token);
            toast.success("Lista excluída com sucesso!");
            onDelete(selectedList.list_id); // Chama a função onDelete para atualizar o estado no componente pai
        } catch (error) {
            toast.error("Erro ao excluir lista:", error);
        }
        closeModal();
    };

    return (
        <div
            className="flex flex-row p-4 rounded-lg bg-gray-700 w-full max-w-sm relative items-center cursor-pointer hover:bg-gray-600 transition-colors group"
            onClick={(event) => handleListClick(event, list.list_id)}
            onAuxClick={(event) => handleListClick(event, list.list_id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleListClick(e, list.list_id);
                }
            }}
        >
            <div className="grid grid-cols-3 gap-2 w-40 h-20 flex-shrink-0">
                {(thumbnail || []).slice(0, 3).map((thumb, index) => (
                    <img
                        key={index}
                        src={thumb || "./src/assets/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                            e.target.src = "./src/assets/placeholder.svg";
                        }}
                    />
                ))}
            </div>

            <div className="ml-4 flex-1">
                <p className="text-white font-bold">{list.name || "Sem nome"}</p>
                <p className="text-gray-400 text-sm">
                    {list.description && list.description.length > 10
                        ? `${list.description.slice(0, 10)}...`
                        : list.description || "Sem descrição"}
                </p>
            </div>
            
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Impede a propagação do evento de clique
                    openModal(list);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                aria-label="Excluir lista"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation(); // Impede a propagação do evento de clique
                        openModal(list);
                    }
                }}
                style={{ display: user?.user_id === list?.owner_user_id ? "flex" : "none" }} // Condicional para mostrar o botão
            >
                ✕
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Confirmar Remoção"
                className="modal-content bg-gray-700 p-6 rounded-lg shadow-lg max-w-md mx-auto text-center"
                overlayClassName="modal-overlay fixed inset-0 bg-opacity-75 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold text-white mb-4">Excluir Lista?</h2>
                <p className="text-gray-300 mb-6">Tem certeza de que deseja excluir "{selectedList?.name}"?</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={confirmDeleteList}
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
        </div>
    );
};

export default ListPreview;