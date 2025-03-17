import axios from 'axios';
import { handleRequest } from './api_list';
const API_URL = 'http://localhost:8000/bookshelf';

const get_comments_for_list = (list_id, token = null) => handleRequest(() => axios.get(`${API_URL}/list/${list_id}/comments`), token);
const get_comments_for_book = (book_id, token = null) => handleRequest(() => axios.get(`${API_URL}/book/${book_id}/comments`), token);

const create_comment_on_list = (comment_to_create, token) => handleRequest(() => axios.post(`${API_URL}/comment/list`, comment_to_create), token);
const create_comment_on_book = (comment_to_create, token) => handleRequest(() => axios.post(`${API_URL}/comment/book`, comment_to_create), token);

const delete_comment_on_list = (list_id, comment_id, user_id, token) => handleRequest(() => axios.delete(`${API_URL}/comment/list/${list_id}/remove/${comment_id}/user/${user_id}`), token);
const delete_comment_on_book = (book_id, comment_id, user_id, token) => handleRequest(() => axios.delete(`${API_URL}/comment/book/${book_id}/remove/${comment_id}/user/${user_id}`), token);

export {
    get_comments_for_list,get_comments_for_book,
    create_comment_on_list,create_comment_on_book,
    delete_comment_on_list,delete_comment_on_book       
}