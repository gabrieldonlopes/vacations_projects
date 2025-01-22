from fastapi import APIRouter, HTTPException
import requests as req
import pandas as pd

from ..schemas import SearchBookShelf, BookSchema
from ..bookShelf.bookShelf_handler import search_book_shelf

router = APIRouter()

@router.get("/search/{search_term}",response_model=SearchBookShelf)
def search_book_shelf(search_term: str):
    try:
        book = search_book_shelf(search_term)
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


