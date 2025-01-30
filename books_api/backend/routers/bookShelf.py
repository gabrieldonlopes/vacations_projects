from fastapi import APIRouter, HTTPException,Depends
from typing import List

from backend.schemas import SearchBookSchema, BookSchema,BookShelfSchema
from backend.bookShelf.bookShelf_handler import search_book_shelf,get_book
from backend.database import get_db
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

@router.post("/book/{id}")
def add_book_to_shelf_endpoint(new_book : BookShelfSchema, db: Session = Depends(get_db)):
    try:
        db_book = BookShelfSchema(user_id=new_book.user_id, book_id=new_book.book_id)      
        db.add(db_book)
        db.commit()
        return  
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/bookshelf/{user_id}")
def get_bookshelf(user_id: int, db: Session = Depends(get_db)):
    try:
        bookshelf = db.query(BookShelfSchema).filter(BookShelfSchema.user_id == user_id).all()
        return bookshelf
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/bookshelf/{user_id}/{book_id}")
def delete_book_from_shelf(user_id: int, book_id: str, db: Session = Depends(get_db)):
    try:
        db.query(BookShelfSchema).filter(BookShelfSchema.user_id == user_id, BookShelfSchema.book_id == book_id).delete()
        db.commit()
        return 
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))