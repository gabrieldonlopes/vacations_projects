import axios from 'axios';

const API_URL = 'http://localhost:8000';

// métodos de Auth
const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams();
        for (const key in credentials) {
            params.append(key, credentials[key]);
        }

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.detail || "Erro ao registrar usuário.";
        throw new Error(errorMessage); 
    }
};

const registerUser = async (userData) => {
    try {
        await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
        const errorMessage = error.response?.data?.detail || "Erro ao registrar usuário.";
        throw new Error(errorMessage); 
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        throw error;
    }
};

// métodos de BookShelf
const search_book = async (search_term) => {
    try {
        const response = await axios.get(`${API_URL}/bookshelf/search/${search_term}`);
        return response.data;
    } catch (error) {
        console.error("Search book shelf error:", error);
        throw error;
    }
};
const add_book_shelf = async (book_id) => {
    try {
        const response = await axios.post(`${API_URL}/books/add`, { book_id });
        return response.data;
    } catch (error) {
        console.error("Add book to bookshelf error:", error);
        throw error;
    }
};
const remove_book_shelf = async (user_id,book_id) => {
    try {
        const response = await axios.post(`${API_URL}/books/remove`,{ user_id }, { book_id });
        return response.data;
    } catch (error) {
        console.error("Remove book from bookshelf error:", error);
        throw error;
    }
}
const get_book = async (book_id) => {
    try {
        const response = await axios.get(`${API_URL}/books/${book_id}`);
        return response.data;
    } catch (error) {
        console.error("Get book error:", error);
        throw error;
    }
}
const get_bookshelf = async (user_id) => {
    try {
        const response = await axios.get(`${API_URL}/bookshelf/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("Get bookshelf error:", error);
        throw error;
    }
}

export { loginUser, registerUser, fetchUserProfile, search_book, add_book_shelf, remove_book_shelf, get_book, get_bookshelf };