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

    // fazer 3 chamadas de api para uma lista não me parece a melhor alternativa
    useEffect(() => {
        let isMounted = true; // Para evitar atualizações de estado em um componente desmontado
    
        const fetchData = async () => {
            try {
                setLoading(true); // Inicia o carregamento
    
                // Busca a lista
                const listData = await get_list(list_id);
                if (isMounted) {
                    setList(listData);
                }
    
                // Busca o usuário dono da lista
                if (listData) {
                    const userData = await get_user_by_id(listData.owner_user_id);
                    if (isMounted) {
                        setUser(userData);
                    }
                }
    
                // Busca os livros da lista
                const booksData = await get_books_from_list(list_id);
                if (isMounted) {
                    setBooks(booksData);
                }
            } catch (error) {
                console.error("Erro ao carregar os dados:", error);
            } finally {
                if (isMounted) {
                    setLoading(false); // Finaliza o carregamento
                }
            }
        };
    
        fetchData();
    
        // Função de limpeza
        return () => {
            isMounted = false;
        };
    }, [list_id]); // Dependências do useEffect

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
                <p className="text-gray-400 mb-4">{list.description}</p>
                <p className="text-gray-400 mb-4">Criada por: {user ? user.username : "Usuário desconhecido"}</p>

                {/* Informações de likes e visibilidade */}
                <div className="flex gap-4 mb-6">
                    <p className="text-gray-600">
                        <span className="font-semibold">Likes:</span> {list.likes || 0}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Visibilidade:</span> {list.public ? "Privada" : "Publica"}
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
                <div className="mt-8 gap-8 text-center">
                    <button
                    onClick={() => navigate(`/add-book/${list_id}`)}
                    className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        adicionar livro
                    </button>
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