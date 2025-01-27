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


class BookShelf(Base):
    __tablename__ = "bookshelves"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    book_id = Column(String, primary_key=True, index=True)

    user = relationship("User", back_populates="bookshelves")
