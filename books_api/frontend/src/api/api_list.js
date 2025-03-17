import axios from 'axios';

const API_URL = 'http://localhost:8000/bookshelf';

// Função genérica para lidar com requisições
const handleRequest = async (requestFunction, token = null) => {
    try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await requestFunction(config); // Passa o config corretamente
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido";
        throw new Error(errorMessage);
    }
};

const get_list = (list_id) => handleRequest((config) => axios.get(`${API_URL}/list/${list_id}`, config));
const get_list_preview_for_user = (user_id) => handleRequest((config) => axios.get(`${API_URL}/user/${user_id}/lists`, config)); //TODO: modificar essa função com inclusão de token
const get_list_preview_for_book = (book_id) => handleRequest((config) => axios.get(`${API_URL}/book/${book_id}/lists`, config));
const add_book_to_list = (list_id, book_data) => handleRequest((config) => axios.post(`${API_URL}/list/${list_id}/add`, book_data, config));
const remove_book_from_list = (list_id, book_id,token) => handleRequest((config) => axios.delete(`${API_URL}/list/${list_id}/remove/${book_id}`, config),token);
const get_books_from_list = (list_id) => handleRequest((config) => axios.get(`${API_URL}/list/${list_id}/books`, config));
const save_list = (user_id, list_id) => handleRequest((config) => axios.post(`${API_URL}/user/${user_id}/save/${list_id}`, {}, config));
const get_saved_lists = (user_id) => handleRequest((config) => axios.get(`${API_URL}/user/${user_id}/saved-lists`, config));

const create_list = (list_to_create, token) => handleRequest((config) => axios.post(`${API_URL}/list/create`, list_to_create, config), token);
const delete_list = (list_id, token) => handleRequest((config) => axios.delete(`${API_URL}/list/delete/${list_id}`, config), token);

export {
    get_list,
    get_list_preview_for_user,
    get_list_preview_for_book,
    create_list,    
    delete_list,
    add_book_to_list,
    remove_book_from_list,
    get_books_from_list,
    save_list,
    get_saved_lists,
    handleRequest
};