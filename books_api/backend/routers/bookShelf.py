from fastapi import APIRouter, HTTPException,Depends
from typing import List

from backend.schemas import SearchBookSchema, BookSchema,CreateListSchema,BookListSchema
from books_api.backend.bookShelf.book_handler import search_book_shelf,get_book
from backend.bookShelf.list_handler import get_lists_for_book, get_lists_for_user
from backend.database import get_db
from backend.models import BookList
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/search/{search_term}", response_model=List[SearchBookSchema])
def search_book_shelf_endpoint(search_term: str):
    try:
        books = search_book_shelf(search_term)
        return books
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/book/{id}", response_model=BookSchema)
def get_book_endpoint(id: str):
    try:
        book = get_book(id)
        return book
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#TODO: Adicionar endpoints para lista
#TODO: Adicionar endpoints para comentários