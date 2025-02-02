import axios from 'axios';
import { handleRequest } from './api_list';
const API_URL = 'http://localhost:8000';

const search_book = (search_term) => handleRequest(() => axios.get(`${API_URL}/bookshelf/search/${search_term}`));
const get_book = (book_id) => handleRequest(() => axios.get(`${API_URL}/bookshelf/book/${book_id}`));


export { search_book, get_book };