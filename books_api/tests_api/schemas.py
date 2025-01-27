from pydantic import BaseModel
from typing import List, Optional
class SearchBookSchema(BaseModel):
    id: str
    volumeInfo_title: str
    volumeInfo_authors: Optional[List[str]] = None
    volumeInfo_pageCount: Optional[int] = None
    volumeInfo_imageLinks_thumbnail: Optional[str] = None
    volumeInfo_averageRating: Optional[float] = None
    volumeInfo_language: Optional[str] = None

class BookSchema(BaseModel):
    title: str
    authors: List[str]
    publisher: Optional[str]
    publishedDate: Optional[str]
    description: Optional[str]
    pageCount: Optional[int]
    categories: List[str]
    imageLinks_large: Optional[str]
    language: Optional[str]
    industryIdentifiers: List[dict]

