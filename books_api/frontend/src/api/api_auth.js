import axios from 'axios';

const API_URL = 'http://localhost:8000';

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

const get_user_by_id = async (user_id) => {
    try {
        const response = await axios.get(`${API_URL}/users/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error); // TODO: adicionar tratamento de erro
        throw error;
    }
}
export { loginUser, registerUser, fetchUserProfile, get_user_by_id };