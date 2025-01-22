from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

class BookShelf(Base):
    __tablename__ = "bookshelves"
    user_id = Column(Integer, primary_key=True,foreign_key="users.id", index=True)
    book_id = Column(String, index=True)