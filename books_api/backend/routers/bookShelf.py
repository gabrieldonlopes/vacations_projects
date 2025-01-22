from fastapi import APIRouter, HTTPException
import requests as req
import pandas as pd

from ..schemas import SearchBookShelf, BookSchema
from ..bookShelf.bookShelf_handler import search_book_shelf

router = APIRouter()

BASE_URL = "https://www.googleapis.com/books/v1/volumes"

API_KEY = "AIzaSyCCldi_nevsZ2hEjc2wjCvugcclkPXweYA"

filter_q = input("Digite o termo de busca: ").strip()
params = {
    "q": filter_q,
    "orderBy": "relevance",
    "projection": "full",
    "maxResults": 20,
    "key": API_KEY
}

@router.get("/search/{search_term}",response_model=SearchBookShelf)
def search_book_shelf(search_term: str):
    try:
        book = search_book_shelf(search_term)
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


