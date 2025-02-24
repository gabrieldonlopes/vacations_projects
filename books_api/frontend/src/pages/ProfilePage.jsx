import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext,AuthProvider } from '../contexts/AuthContext.jsx';
import ListPreview  from '../components/ListPreview.jsx';
import { toast } from "react-toastify";
import { get_list_preview_for_user } from '../api/api_list.js';
import Header from '../components/Header.jsx';
const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [createdLists, setCreatedLists] = useState([]);
    const [savedLists, setSavedLists] = useState([]);
    const [savedBooks, setSavedBooks] = useState([]);  
    // por algum motivo o useEffect está fazendo duas chamadas da api ao mesmo tempo
    // TODO: resolver isso
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return null;
        } else {
            get_list_preview_for_user(user.user_id).then((response) => {
                setCreatedLists(response || []);
                setLoading(false); 
            }).catch(error => {
                console.error("Erro ao buscar listas:", error);
                setLoading(false);
            });
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success("Logged out successfully");
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
    }
    // TODO: Adicionar foto de perfil
    return (
        <div className="min-h-screen py-10 px-6 relative ">
            <div className="max-w-6xl mx-auto p-10 rounded-lg shadow-lg bg-gray-800">
                <div className="flex flex-col items-center md:flex-row md:items-start">
                    <div className="mb-6 md:mb-0 text-center">
                        <img
                            src={user.avatar || "./src/assets/owl.jpeg"}
                            alt={user.username || "User Avatar"}
                            className="w-40 h-40 object-cover rounded-full shadow-md"
                        />
                        <div className="flex justify-center mt-4 gap-6">
                        
                        </div>
                    </div>
                    <div className="md:ml-6 text-center md:text-left mt-4 md:mt-0">
                        <h1 className="text-3xl font-bold text-white mb-6">{user.username || "Usuário"}</h1>
                        <p className="text-xl text-gray-400 mb-4">
                            Email: {user.email || "Não informado"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400">
                        </div>
                    </div>
                </div>
                <div>
                <h2 className="text-2xl font-bold text-white mb-4">Listas Criadas</h2>
                    <hr className='opacity-50'></hr>
                    <div>
                    {createdLists?.length > 0 ? (
                        createdLists.map((list) => <ListPreview list={list} />)
                    ) : (
                        <p className="text-gray-400">Nenhuma lista criada.</p>
                    )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Listas Salvas</h2>
                    <hr className='opacity-50'></hr>
                    <h2 className="text-2xl font-bold text-white mb-4">Livros Salvos</h2>
                    <hr className='opacity-50'></hr>


                </div>
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
