from fastapi import APIRouter, HTTPException, Depends
from typing import List, Callable
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
from backend.schemas import (
    SearchBookSchema, BookSchema, ListCreate, ListPreview, 
    BookSavedSchema, ListComments, BookComments, ListSchema
)
from backend.bookShelf.book_handler import search_book_shelf, get_book
from backend.bookShelf.list_handler import (
    get_list, get_lists_for_user, get_lists_for_book, get_saved_books_for_list,
    create_list, delete_list, add_book_to_list, remove_book_from_list,
    save_list, get_saved_lists
)
from backend.bookShelf.comment_handler import (
    get_comments_for_list, create_comment_on_list, delete_comment_on_list,
    get_comments_for_book, create_comment_on_book, delete_comment_on_book
)
from backend.database import get_db

router = APIRouter()

# TODO: adicionar endpoint para dar like numa lista
# TODO: adicionar endpoint para mudar a visibilidade de uma lista
# TODO: separarar endpoints em outros routers

async def handle_request(func: Callable, *args, **kwargs):
    """Encapsula chamadas para tratamento padronizado de erros"""
    try:
        if asyncio.iscoroutinefunction(func):  # Verifica se a função é async
            return await func(*args, **kwargs)
        return func(*args, **kwargs)  # Executa normalmente se for síncrona 
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoints para livro
@router.get("/search/{search_term}", response_model=List[SearchBookSchema])
async def search_book_shelf_endpoint(search_term: str):
    return await handle_request(search_book_shelf, search_term)


@router.get("/book/{id}", response_model=BookSchema)
async def get_book_endpoint(id: str):
    return await handle_request(get_book, id)


# Endpoints para lista
@router.get("/list/{list_id}", response_model=ListSchema)
async def get_list_endpoint(list_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_list, list_id, db)


@router.get("/user/{user_id}/lists", response_model=List[ListPreview])
async def get_lists_for_user_endpoint(user_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_lists_for_user, user_id, db)


@router.get("/book/{book_id}/lists", response_model=List[ListPreview])
async def get_lists_for_book_endpoint(book_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_lists_for_book, book_id, db)


@router.get("/list/{list_id}/books", response_model=List[BookSavedSchema])
async def get_books_from_list_endpoint(list_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_saved_books_for_list, list_id, db)


@router.post("/list/create")
async def create_list_endpoint(list_to_create: ListCreate, db: AsyncSession = Depends(get_db)):
    return await handle_request(create_list, list_to_create, db)


@router.delete("/list/delete/{list_id}")
async def delete_list_endpoint(list_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(delete_list, list_id, db)

#TODO: verificação de usuário ao alterar uma lista
@router.post("/list/{list_id}/add")
async def add_book_to_list_endpoint(list_id: int, book: BookSavedSchema, db: AsyncSession = Depends(get_db)):
    return await handle_request(add_book_to_list, list_id, book, db)


@router.delete("/list/{list_id}/remove/{book_id}")
async def remove_book_from_list_endpoint(list_id: int, book_id: str, db: AsyncSession = Depends(get_db)):
    return await handle_request(remove_book_from_list, list_id, book_id, db)


@router.post("/user/{user_id}/save/{list_id}")
async def save_list_endpoint(user_id: int, list_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(save_list, user_id, list_id, db)


@router.get("/user/{user_id}/saved-lists", response_model=List[ListPreview])
async def get_saved_lists_endpoint(user_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_saved_lists, user_id, db)


# Endpoints para comentários
#TODO: verificação de usuário ao comentar
#TODO: verificar erros
@router.get("/list/{list_id}/comments", response_model=List[ListComments])
async def get_comments_for_list_endpoint(list_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_comments_for_list, list_id, db)


@router.post("/comment/list", response_model=ListComments)
async def comment_on_list_endpoint(comment: ListComments, db: AsyncSession = Depends(get_db)):
    return await handle_request(create_comment_on_list, comment, db)


@router.delete("/comment/list/{list_id}/remove/{comment_id}/user/{user_id}")
async def delete_comment_on_list_endpoint(list_id: int, comment_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(delete_comment_on_list, list_id, comment_id, user_id, db)


@router.get("/book/{book_id}/comments", response_model=List[BookComments])
async def get_comments_for_book_endpoint(book_id: int, db: AsyncSession = Depends(get_db)):
    return await handle_request(get_comments_for_book, book_id, db)


@router.post("/comment/book", response_model=BookComments)
async def comment_on_book_endpoint(comment: BookComments, db: AsyncSession = Depends(get_db)):
    return await handle_request(create_comment_on_book, comment, db)


@router.delete("/comment/book/{book_id}/remove/{comment_id}/user/{user_id}")
async def delete_comment_on_book_endpoint(book_id: int, comment_id: int, user_id: int, db: AsyncSession = Depends(get_db)): 
    return await handle_request(delete_comment_on_book, book_id, comment_id, user_id, db)
