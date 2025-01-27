import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import UserProfile from './components/UserProfile.jsx';

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
                        </Routes>

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
