from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    bookshelves = relationship("BookShelf", back_populates="user")

class SavedLists(Base): # tabela de relacionamento utilizada quando o usuário salva uma tabela (n .. n)
    __tablename__ = "savedLists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    book_list_id = Column(Integer, ForeignKey("bookLists.id"), primary_key=True, index=True)

    user = relationship("User", back_populates="savedlists")
    booklist = relationship("BookList", back_populates="savedlists")


class BookList(Base):
    __tablename__ = "bookLists"

    id = Column(Integer, primary_key=True, index=True)
    owner_user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True) # utilizado para relacionamento 1 .. n, ou seja quando um usuário cria uma estante, ele cria uma tabela para ela
    name = Column(String, index=True)
    description = Column(String, index=True)
    likes = Column(Integer, index=True)
    visibility = Column(Boolean, default=True)

    user = relationship("User", back_populates="bookshelves")

class BookSaved(Base): # essa tabela serve para guardar os livros salvos em uma estante
    __tablename__ = "booksSaved"

    saved_book_id = Column(Integer, primary_key=True, index=True)
    book_list_id = Column(Integer, ForeignKey("bookLists.id"), primary_key=True, index=True)
    book_id = Column(Integer, index=True)
    book_title = Column(String, index=True)
    book_thumbnail = Column(String, index=True)

    booklist = relationship("BookList", back_populates="booksaved")
    
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    book_list_id = Column(Integer, ForeignKey("bookLists.id"), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    comment = Column(String, index=True)

    booklist = relationship("BookList", back_populates="comments")
    user = relationship("User", back_populates="comments")