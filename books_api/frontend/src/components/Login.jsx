// src/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData.username, formData.password);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4 p-6 w-full max-w-md'>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} 
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
            <input type="password" name="password" placeholder="Password" onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;