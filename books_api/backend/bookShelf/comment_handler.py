from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from backend.database import get_db
from backend.models import ListComments, BookComments

#TODO: generalizar o uso de comentários
#TODO: adicionar filtros de palavras proibidas
#TODO: adicionar métodos para alterar comentários
async def create_comment_on_list (comment: ListComments, db: AsyncSession = Depends(get_db)):
    try:
        db_comment = ListComments(list_id=comment.list_id, user_id=comment.user_id, comment=comment.comment)
        db.add(db_comment)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_comments_for_list(list_id: int, db: AsyncSession = Depends(get_db)) -> List[ListComments]:
    result = await db.execute(select(ListComments).filter(ListComments.list_id == list_id))
    comments = result.scalars().all()
    return comments

async def delete_comment_on_list(list_id: int,comment_id: int,user_id: int,db: AsyncSession = Depends(get_db)):
    try:
        comment = await db.get(ListComments, comment_id)
        if not comment or comment.list_id != list_id:
            raise HTTPException(status_code=404, detail="Comment not found.")
        elif comment.user_id != user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own comments.")
        await db.delete(comment)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_comment_on_book(comment: BookComments, db: AsyncSession = Depends(get_db)):
    try:
        db_comment = BookComments(book_id=comment.book_id, user_id=comment.user_id, comment=comment.comment)
        db.add(db_comment)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def get_comments_for_book(book_id: str, db: AsyncSession = Depends(get_db)) -> List[BookComments]:
    result = await db.execute(select(BookComments).filter(BookComments.book_id == book_id))
    comments = result.scalars().all()
    return comments

async def delete_comment_on_book(book_id: str,comment_id: int,user_id: int,db: AsyncSession = Depends(get_db)):
    try:
        comment = await db.get(BookComments, comment_id)
        if not comment or comment.book_id != book_id:
            raise HTTPException(status_code=404, detail="Comment not found.")
        elif comment.user_id != user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own comments.")
        await db.delete(comment)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))