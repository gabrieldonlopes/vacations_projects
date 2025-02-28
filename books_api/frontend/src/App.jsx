import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Importe o ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importe o CSS do toastify
import SearchPage from './pages/SearchPage.jsx';
import BookPage from './pages/BookPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ListPage from './pages/ListPage.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/book/:book_id" element={<BookPage />} />
                    <Route path="/list/:list_id" element={<ListPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;