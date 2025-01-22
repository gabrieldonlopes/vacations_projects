from pydantic import BaseModel
from typing import List, Optional

class SearchBookSchema(BaseModel):
    id: str
    selfLink: str
    volumeInfo_title: str
    volumeInfo_authors: List[str]
    volumeInfo_pageCount: Optional[int]
    volumeInfo_imageLinks_thumbnail: Optional[str]
    volumeInfo_averageRating: Optional[str]
    volumeInfo_language: Optional[str]

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

