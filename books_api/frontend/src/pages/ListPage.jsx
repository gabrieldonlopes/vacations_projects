import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get_list, get_books_from_list } from "../api/api_list";
import { get_user_by_id } from "../api/api_auth";
import BookPreview from "../components/BookPreview"; // Importe o componente BookPreview ou BookSavedPreview

const ListPage = () => {
    const { list_id } = useParams();  // Obtém o list_id da URL
    const [list, setList] = useState(null);
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);  // Estado de carregamento

    useEffect(() => {
        const fetchList = async () => {
            try {
                const data = await get_list(list_id);
                setList(data);
            } catch (error) {
                console.error("Erro ao carregar a lista:", error);
            }
        };

        const fetchUser = async () => {
            try {
                if (list) {
                    const data = await get_user_by_id(list.owner_user_id);
                    setUser(data);
                }
            } catch (error) {
                console.error("Erro ao carregar o usuário:", error);
            }
        };

        const fetchListBooks = async () => {
            try {
                const data = await get_books_from_list(list_id);
                setBooks(data);
            } catch (error) {
                console.error("Erro ao carregar os livros da lista:", error);
            } finally {
                setLoading(false);  // Fim do carregamento
            }
        };

        fetchList();
        fetchUser();
        fetchListBooks();
    }, [list_id, list]);  // Dependências do useEffect

    useEffect(() => {
        if (list) {
            fetchUser();
        }
    }, [list]);  // Executa fetchUser quando a lista é carregada

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full" role="status">
                    </div>
                    <p className="text-2xl font-semibold mt-4">Carregando informações da lista...</p>
                </div>
            </div>
        );  // Exibe o spinner e texto de carregamento
    }

    if (!list) {
        return <div className="text-center text-2xl text-gray-700">Lista não encontrada.</div>;
    }

    return (
        <div className="min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">{list.name}</h1>
                <p className="text-gray-600 mb-4">{list.description}</p>
                <p className="text-gray-600 mb-4">Criada por: {user ? user.name : "Usuário desconhecido"}</p>

                {/* Informações de likes e visibilidade */}
                <div className="flex gap-4 mb-6">
                    <p className="text-gray-600">
                        <span className="font-semibold">Likes:</span> {list.likes || 0}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Visibilidade:</span> {list.public ? "Pública" : "Privada"}
                    </p>
                </div>

                {/* Exibição dos livros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <BookPreview key={book.id} book={book} />
                        ))
                    ) : (
                        <p className="text-center text-2xl text-gray-700 col-span-full">
                            A lista ainda não possui nenhum livro.
                        </p>
                    )}
                </div>

                {/* Botão de voltar */}
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