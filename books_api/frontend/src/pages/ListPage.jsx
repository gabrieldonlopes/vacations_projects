import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get_list, add_book_to_list, remove_book_from_list } from "../api/api_list";
import { get_user_by_id } from "../api/api_auth";
import BookSavedPreview from "../components/BookSavedPreview";
import { AuthContext } from "../contexts/AuthContext";

const ListPage = () => {
    const { list_id } = useParams();
    const [list, setList] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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
                if (error.name !== 'AbortError') {
                    console.error("Erro ao carregar os dados:", error);
                    setError("Erro ao carregar a lista. Tente novamente mais tarde.");
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

    const handleAddBook = async (bookId) => {
        try {
            await add_book_to_list(list_id, bookId);
            const updatedList = await get_list(list_id);
            setList(updatedList);
        } catch (error) {
            console.error("Erro ao adicionar livro:", error);
        }
    };

    const handleRemoveBook = async (bookId) => {
        try {
            await remove_book_from_list(list_id, bookId);
            const updatedList = await get_list(list_id);
            setList(updatedList);
        } catch (error) {
            console.error("Erro ao remover livro:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full" role="status">
                    </div>
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
        <div className="min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">{list.name}</h1>
                <p className="text-gray-400 mb-4">{list.description}</p>
                <p className="text-gray-400 mb-4">Criada por: {user ? user.username : "Usuário desconhecido"}</p>

                <div className="flex gap-4 mb-6">
                    <p className="text-gray-600">
                        <span className="font-semibold">Likes:</span> {list.likes || 0}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Visibilidade:</span> {list.visibility ? "Pública" : "Privada"}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(list.books) && list.books.length > 0 ? (
                        list.books.map((book) => (
                            <BookSavedPreview
                            book={book}
                            />
                        ))
                    ) : (
                        <p className="text-center text-2xl text-gray-700 col-span-full">
                            A lista ainda não possui nenhum livro.
                        </p>
                    )}
                </div>

                <div className="mt-8 gap-8 text-center">
                    <button
                        onClick={() => handleAddBook("ID_DO_LIVRO_AQUI")}
                        className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Adicionar livro
                    </button>
                    <button
                        onClick={() => navigate(-1)}
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