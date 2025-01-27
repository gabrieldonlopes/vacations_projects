// src/Register.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); // método esquisitão
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData.username, formData.email, formData.password); // o AuthContext permite a utilização de seu método por esse componente
    };

    return (
<form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4 p-6 w-full max-w-md'>
    <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
    />
    <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
    />
    <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
    />
    <button
        type="submit"
        className='w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
    >
        Register
    </button>
</form>

    );
};

export default Register;