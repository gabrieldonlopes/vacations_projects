from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete


from backend.database import get_db
from backend.models import BookList, BookSaved, SavedLists,User
from backend.schemas import ListSchema, BookSavedSchema, ListCreate, ListPreview, UserResponse

from ..auth.auth_handler import get_current_active_user
# TODO: ADICIONAR MENSAGENS EM CASO DE SUCESSO 

async def verify_owner_user(list: BookList,user: User = Depends(get_current_active_user)):
    if user.user_id != list.owner_user_id:
        raise HTTPException(status_code=403, detail="You're not the owner of the list.")
    
async def transform_list_to_list_response(list_obj: ListSchema, db: AsyncSession) -> ListPreview:
    list_id = list_obj.list_id
    owner_user_id = list_obj.owner_user_id
    name = list_obj.name
    description = list_obj.description
    visibility = list_obj.visibility
    
    thumbnail = [book.book_thumbnail for book in await get_saved_books_for_list(list_id, db) if book.book_thumbnail][0:4]
    
    return ListPreview(
        list_id=list_id, owner_user_id=owner_user_id, name=name, description=description, 
        thumbnail=thumbnail, visibility=visibility
    )

async def get_list(list_id: int, db: AsyncSession = Depends(get_db)) -> ListSchema:
    result = await db.execute(select(BookList).filter(BookList.list_id == list_id))
    list_obj = result.scalars().first()
    if not list_obj:
            raise HTTPException(status_code=404, detail="List not found.")
    books = await get_saved_books_for_list(list_id, db)
    list = ListSchema(
        list_id=list_obj.list_id,owner_user_id=list_obj.owner_user_id, 
        name=list_obj.name, description=list_obj.description,
        likes=list_obj.likes, visibility=list_obj.visibility, books=books
    )
    return list

async def get_saved_books_for_list(list_id: int, db: AsyncSession = Depends(get_db)) -> List[BookSavedSchema]:
    result = await db.execute(select(BookSaved).filter(BookSaved.book_list_id == list_id))
    books = result.scalars().all()
    return [BookSavedSchema.model_validate(book) for book in books]

async def get_lists_for_user(user_id: int, db: AsyncSession = Depends(get_db)) -> List[ListPreview]:
    result = await db.execute(select(BookList).filter(BookList.owner_user_id == user_id))
    lists = result.scalars().all()
    return [await transform_list_to_list_response(list_obj, db) for list_obj in lists]

async def get_lists_for_book(book_id: str, db: AsyncSession = Depends(get_db)) -> List[ListPreview]:
    result = await db.execute(select(BookSaved).filter(BookSaved.book_id == book_id))
    books_saved = result.scalars().all()
    if not books_saved:
        return []
    
    book_list_ids = [b.book_list_id for b in books_saved]
    result = await db.execute(select(BookList).filter(BookList.list_id.in_(book_list_ids)))
    book_lists = result.scalars().all()

    lists = []
    for book_list in book_lists:
        list_preview = await transform_list_to_list_response(book_list, db)
        lists.append(list_preview)

    return lists

async def get_saved_lists(user_id: int, db: AsyncSession = Depends(get_db)) -> List[ListPreview]:
    result = await db.execute(select(SavedLists).filter(SavedLists.user_id == user_id))
    lists = result.scalars().all()
    return [await transform_list_to_list_response(list_obj, db) for list_obj in lists]

async def create_list(list_data: ListCreate, db: AsyncSession = Depends(get_db)):
    existing_list = await db.execute(select(BookList).filter(BookList.name == list_data.name))
    if existing_list.scalars().first() == None:
        db_list = BookList(
        owner_user_id=list_data.owner_user_id, name=list_data.name, 
        description=list_data.description, visibility=list_data.visibility
         )
        db.add(db_list)
        await db.commit()
        return {"message": "List created successfully"}
    else:    
        raise HTTPException(status_code=400, detail="List name already registered.")

async def delete_list(list_id: int, user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)): 
    try:
        result = await db.execute(select(BookList).filter(BookList.list_id == list_id))
        list_obj = result.scalars().first()
        
        if not list_obj:
            raise HTTPException(status_code=404, detail="List not found.")  
        
        await verify_owner_user(list=list_obj, user=user)
        
        books = await db.execute(select(BookSaved).where(BookSaved.book_list_id == list_id))
        books_obj = books.scalars().all()
        for book in books_obj:
            await db.delete(book)
        
        await db.delete(list_obj)
        await db.commit()

        return {"message": "List deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def save_list(user_id: int, list_id: int, db: AsyncSession = Depends(get_db)):
    db_list = await db.get(BookList, list_id)
    if not db_list:
        raise HTTPException(status_code=404, detail="List not found.")
    
    saved_list = SavedLists(book_list_id=list_id, user_id=user_id)
    db.add(saved_list)
    await db.commit()

    return {"message": "List saved successfully"}

async def add_book_to_list(list_id: int, book: BookSavedSchema, db: AsyncSession = Depends(get_db)):
    try: # TODO: pensar numa forma mais inteligente de fazer essa verificação
        db_book = BookSaved(
        book_list_id=list_id, book_id=book.book_id,
        book_title=book.book_title, book_thumbnail=book.book_thumbnail
        )
        db.add(db_book)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": "Book added to list successfully"}

async def remove_book_from_list(list_id: int, book_id: str, user: User = Depends(get_current_active_user),db: AsyncSession = Depends(get_db)): 
    try:
        result = await db.execute(select(BookList).filter(BookList.list_id == list_id))
        list_obj = result.scalars().first()
        if not list_obj:    
            raise HTTPException(status_code=404, detail="List not found.")
        await verify_owner_user(list=list_obj,user=user) #TODO: melhorar essa verificação para reduzir a quantidade de consultas
        book = await db.execute(select(BookSaved).filter(BookSaved.book_id == book_id and BookSaved.book_list_id == list_id))
        book_obj = book.scalars().first()
        if not book_obj:    
            raise HTTPException(status_code=404, detail="Book not found.")
        saved_book_id = book_obj.saved_book_id
        selected_book = await db.execute(select(BookSaved).filter(BookSaved.saved_book_id == saved_book_id))
        selected_book_obj = selected_book.scalars().first()
        await db.delete(selected_book_obj)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": "Book removed from list successfully"}