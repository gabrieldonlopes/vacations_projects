from fastapi import APIRouter, HTTPException
from typing import List

from backend.schemas import SearchBookSchema, BookSchema
from backend.bookShelf.bookShelf_handler import search_book_shelf,get_book

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
