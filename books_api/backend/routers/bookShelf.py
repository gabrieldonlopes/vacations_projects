from fastapi import APIRouter, HTTPException,Depends
from typing import List

from backend.schemas import SearchBookSchema, BookSchema, ListCreate, ListResponse, BookSavedSchema
from backend.bookShelf.book_handler import search_book_shelf,get_book
from backend.bookShelf.list_handler import *
from backend.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

# endpoints para livro
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


# endpoints para lista
@router.get("/list/{user_id}", response_model=List[ListResponse])
def get_lists_for_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    try:
        lists = get_lists_for_user(user_id, db)
        return lists
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list/{book_id}", response_model=List[ListResponse])
def get_lists_for_book_endpoint(book_id: int, db: Session = Depends(get_db)):
    try: 
        lists = get_lists_for_book(book_id, db)
        return lists
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list/books/{list_id}", response_model=List[BookSavedSchema])
def get_saved_books_from_list_endpoint(list_id: int, db: Session = Depends(get_db)):
    try:
        books = get_saved_books_for_list(list_id, db)
        return books
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/list/create")
def create_list_endpoint(list_to_create: ListCreate, db: Session = Depends(get_db)):
    try:
        saved_list = create_list(list_to_create, db)
        return saved_list
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/list/delete/{list_id}")
def delete_list_endpoint(list_id: int, db: Session = Depends(get_db)):
    try:
        delete_list(list_id, db)
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/list/add/{list_id}")
def add_book_to_list_endpoint(list_id: int, book: BookSavedSchema, db: Session = Depends(get_db)):
    try:
        add_book_to_list(list_id, book, db)
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/list/remove/{saved_book_id}")
def remove_book_from_list_endpoint(saved_book_id: int, db: Session = Depends(get_db)):
    try:
        delete_book_from_list(saved_book_id, db)
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/list/save/{user_id}/{list_id}")
def save_list_endpoint(user_id: int, list_id: int, db: Session = Depends(get_db)):
    try:
        save_list(user_id, list_id, db)
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list/{user_id}", response_model=List[ListResponse])
def get_saved_lists_endpoint(user_id: int, db: Session = Depends(get_db)):
    try:
        lists = get_saved_lists(user_id, db)
        return lists
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# endpoints para comentários
@router.get("/comment/{list_id}", response_model=List[Comment])
def get_comments_for_list_endpoint(list_id: int, db: Session = Depends(get_db)):
    try:
        comments = get_comments_for_list(list_id, db)
        return comments 
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/comment")
def comment_on_list_endpoint(comment: Comment, db: Session = Depends(get_db)):
    try:    
        comment_on_list(comment, db)
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/comment/{comment_id}")
def delete_comment_endpoint(comment_id: int, db: Session = Depends(get_db)):
    try:    
        delete_comment(comment_id, db)
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
