from pydantic import BaseModel
from typing import List, Optional

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str | None = None

class UserInDB(UserResponse):
    hashed_password: str

# Book Schemas
class SearchBookSchema(BaseModel):
    id: str
    volumeInfo_title: str
    volumeInfo_authors: List[str]
    volumeInfo_pageCount: Optional[int]
    volumeInfo_imageLinks_thumbnail: Optional[str] | None
    volumeInfo_averageRating: Optional[float]
    volumeInfo_language: Optional[str]

class BookSchema(BaseModel):
    id: str
    title: str
    authors: List[str]
    publisher: Optional[str]
    publishedDate: Optional[str]
    description: Optional[str]
    pageCount: Optional[int]
    categories: List[str]
    imageLinks_large: Optional[str]
    language: Optional[str]
    industryIdentifiers: Optional[List[dict]]

class BookSavedSchema(BaseModel): # tira necessidade de fazer uma chamada da api
    saved_book_id: int # permite que o mesmo livro esteja salvo em mais de uma lista 
    book_id: str
    book_title: str
    book_thumbnail: str # TODO: adicionar uma forma de pegar a url da imagem exemplo. caso não haja thumbnail, usar um default
    class Config:
        from_attributes = True
class ListSchema(BaseModel):
    list_id: int
    owner_user_id: int
    name: str
    description: Optional[str]
    likes: int
    visibility: bool
    books: List[BookSavedSchema]
    class Config:
        from_attributes = True

class ListCreate(BaseModel):
    owner_user_id: int
    name: str
    description: Optional[str]
    visibility: bool

class ListResponse(BaseModel):
    list_id: int
    name: str
    description: Optional[str]
    thumbnail: Optional[List[str]]
    visibility: bool

class Comment(BaseModel):
    list_id: int
    user_id: int
    comment: str

