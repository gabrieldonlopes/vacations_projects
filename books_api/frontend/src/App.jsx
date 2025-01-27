import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import SearchBook from './components/SearchBook.jsx';
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col items-center justify-center min-h-screen  rounded-lg shadow-lg">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold mb-8">MyBiblioteca</h1>
                        
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/search" element={<SearchBook />} />
                        </Routes>
                        <ToastContainer position="top-right" autoClose={3000} />
                        <div className="mt-4">
                            <span className="text-sm text-gray-600">Não tem uma conta? </span>
                            <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">
                                Registre-se
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
