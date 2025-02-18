import axios from 'axios';

const API_URL = 'http://localhost:8000/bookshelf';

const handleRequest = async (requestFunction) => {
    try {
        const response = await requestFunction();
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido";
        throw new Error(errorMessage);
    }
};

const get_list = (list_id) => handleRequest(() => axios.get(`${API_URL}/list/${list_id}`));

const get_list_preview_for_user = (user_id) => handleRequest(() => axios.get(`${API_URL}/user/${user_id}/lists`));

const get_list_preview_for_book = (book_id) => handleRequest(() => axios.get(`${API_URL}/book/${book_id}/lists`));

const create_list = (list_to_create) => handleRequest(() => axios.post(`${API_URL}/list/create`, list_to_create));

const delete_list = (list_id) => handleRequest(() => axios.delete(`${API_URL}/list/delete/${list_id}`));

const add_book_to_list = (list_id, book_data) => handleRequest(() => axios.post(`${API_URL}/list/${list_id}/add`, book_data));

const remove_book_from_list = (list_id, book_id) => handleRequest(() => axios.delete(`${API_URL}/list/${list_id}/remove/${book_id}`));

const get_books_from_list = (list_id) => handleRequest(() => axios.get(`${API_URL}/list/${list_id}/books`));

const save_list = (user_id, list_id) => handleRequest(() => axios.post(`${API_URL}/user/${user_id}/save/${list_id}`));

const get_saved_lists = (user_id) => handleRequest(() => axios.get(`${API_URL}/user/${user_id}/saved-lists`));

export {
    handleRequest, 
    get_list, 
    get_list_preview_for_user, 
    get_list_preview_for_book, 
    create_list, 
    delete_list, 
    add_book_to_list, 
    remove_book_from_list, 
    get_books_from_list, 
    save_list, 
    get_saved_lists 
};
