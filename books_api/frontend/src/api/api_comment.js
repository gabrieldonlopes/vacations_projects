import axios from 'axios';
import { handleRequest } from './api_list';
const API_URL = 'http://localhost:8000/bookshelf';

// GET
const get_comments_for_list = (list_id) => handleRequest(() => axios.get(`${API_URL}/list/${list_id}/comments`));
const get_comments_for_book = (book_id) => handleRequest(() => axios.get(`${API_URL}/book/${book_id}/comments`));

// POST
const create_comment_on_list = (comment_to_create) => handleRequest(() => axios.post(`${API_URL}/comment/list`, comment_to_create));
const create_comment_on_book = (comment_to_create) => handleRequest(() => axios.post(`${API_URL}/comment/book`, comment_to_create));

// DELETE
const delete_comment_on_list = (list_id, comment_id) => handleRequest(() => axios.delete(`${API_URL}/comment/list/${list_id}/remove/${comment_id}/user/${user_id}`));
const delete_comment_on_book = (book_id, comment_id) => handleRequest(() => axios.delete(`${API_URL}/comment/book/${book_id}/remove/${comment_id}/user/${user_id}`));

export {
    get_comments_for_list,get_comments_for_book,
    create_comment_on_list,create_comment_on_book,
    delete_comment_on_list,delete_comment_on_book
}