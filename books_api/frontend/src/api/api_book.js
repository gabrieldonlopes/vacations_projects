import axios from 'axios';
const API_URL = 'http://localhost:8000';
const handleRequest = async (requestFunction) => {
    try {
        const response = await requestFunction();
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido";
        throw new Error(errorMessage);
    } 
}
const search_book = (search_term) => handleRequest(() => axios.get(`${API_URL}/bookshelf/search/${search_term}`));
const get_book = (book_id) => handleRequest(() => axios.get(`${API_URL}/bookshelf/book/${book_id}`));


export { search_book, get_book };