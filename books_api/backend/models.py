from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase

class Base(AsyncAttrs, DeclarativeBase): # atualização de models para operações assincronas
    pass
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    book_lists = relationship("BookList", back_populates="user")
    saved_lists = relationship("SavedLists", back_populates="user")
    list_comments = relationship("ListComments", back_populates="user")
    book_comments = relationship("BookComments", back_populates="user")


class SavedLists(Base):  # Tabela de relacionamento (n .. n)
    __tablename__ = "saved_lists"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True, index=True)
    book_list_id = Column(Integer, ForeignKey("book_lists.list_id"), primary_key=True, index=True)

    user = relationship("User", back_populates="saved_lists")
    book_list = relationship("BookList", back_populates="saved_lists")


class BookList(Base):
    __tablename__ = "book_lists"

    list_id = Column(Integer, primary_key=True, index=True)
    owner_user_id = Column(Integer, ForeignKey("users.user_id"), index=True)  
    name = Column(String, index=True)
    description = Column(String, index=True)
    likes = Column(Integer, default=0,index=True)  # TODO: adicionar lógica de likes
    visibility = Column(Boolean, default=True)  # TODO: adicionar lógica de visibilidade

    user = relationship("User", back_populates="book_lists")
    saved_books = relationship("BookSaved", back_populates="book_list")
    saved_lists = relationship("SavedLists", back_populates="book_list")
    comments = relationship("ListComments", back_populates="book_list")

# TODO: uma alternativa seria adicionar uma coluna com o id de quem salvou o livro
class BookSaved(Base):  # Essa tabela guarda os livros salvos em uma estante
    __tablename__ = "books_saved"

    saved_book_id = Column(Integer, primary_key=True, index=True) # TODO: mudar o nome dessa coluna (confuso)
    book_list_id = Column(Integer, ForeignKey("book_lists.list_id"), index=True)
    book_id = Column(String, index=True)
    book_title = Column(String, index=True)
    book_thumbnail = Column(String, index=True)

    book_list = relationship("BookList", back_populates="saved_books")


class ListComments(Base):
    __tablename__ = "list_comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    book_list_id = Column(Integer, ForeignKey("book_lists.list_id"), index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), index=True)
    comment = Column(String, index=True)

    book_list = relationship("BookList", back_populates="comments")
    user = relationship("User", back_populates="list_comments")


class BookComments(Base):
    __tablename__ = "book_comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    book_id = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), index=True)
    comment = Column(String, index=True)

    user = relationship("User", back_populates="book_comments")
