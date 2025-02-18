import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage.jsx';
import BookPage from './pages/BookPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
const App = () => {
    return (
        <Router>
            <AuthProvider> 
            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/book/:book_id" element={<BookPage />} />
            </Routes>
            </AuthProvider>
        </Router>
    );
};  

export default App;
