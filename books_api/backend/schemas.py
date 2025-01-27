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

class BookShelfSchema(BaseModel):
    user_id: int
    book_id: str
