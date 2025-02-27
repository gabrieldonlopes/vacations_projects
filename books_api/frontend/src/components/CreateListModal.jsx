import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { create_list } from "../api/api_list";
import { AuthContext } from "../contexts/AuthContext";

const CreateListModal = ({ isOpen, onClose }) => {
    const [listData, setListData] = useState({
        name: "",
        description: "",
    });
    const { user } = useContext(AuthContext);

    const resetForm = () => {
        setListData({
            name: "",
            description: "",
        });
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

    const handleCreateList = async () => {
        try {
            const response = await create_list({
                owner_user_id: user.user_id,
                name: listData.name,
                description: listData.description,
                visibility: true,
            });
            if (response.success) {
                toast.success("Lista criada com sucesso!");
                closeModal();
            } else {
                toast.error("Erro ao criar a lista.");
            }
        } catch (error) {
            console.error("Erro ao criar a lista:", error);
            toast.error("Erro ao criar a lista.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Criar nova lista"
            className="modal-content bg-gray-700 p-6 rounded-lg shadow-lg max-w-md mx-auto text-center"
            overlayClassName="modal-overlay fixed inset-0 bg-opacity-75 flex items-center justify-center"
        >
            <h2 className="text-2xl font-bold text-white mb-6">Criar Nova Lista</h2>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (!listData.name || !listData.description) {
                        toast.error("Por favor, preencha todos os campos.");
                        return;
                    }
                    await handleCreateList();
                    resetForm();
                    closeModal();   
                }}
            >
                <div className="mb-4">
                    <input
                        type="text"
                        name="listName"
                        placeholder="Nome da Lista"
                        className={`border ${
                            !listData.name ? "border-red-500" : "border-gray-400"
                        } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={listData.name}
                        onChange={(e) => setListData({ ...listData, name: e.target.value })}
                        required
                    />
                    {!listData.name && (
                        <p className="text-red-500 text-sm mt-1">O nome da lista é obrigatório.</p>
                    )}
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        name="listDescription"
                        placeholder="Descrição"
                        className={`border ${
                            !listData.description ? "border-red-500" : "border-gray-400"
                        } rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={listData.description}
                        onChange={(e) => setListData({ ...listData, description: e.target.value })}
                        required
                    />
                    {!listData.description && (
                        <p className="text-red-500 text-sm mt-1">A descrição é obrigatória.</p>
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Criar Lista
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateListModal;