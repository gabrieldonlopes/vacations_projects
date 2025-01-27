import pandas as pd
import requests as req
from fastapi import HTTPException, APIRouter
from typing import List
import os
from dotenv import load_dotenv
load_dotenv()

from backend.schemas  import SearchBookSchema, BookSchema

router = APIRouter()

def search_book_shelf(search_term: str) -> List[SearchBookSchema]:
    BASE_URL = "https://www.googleapis.com/books/v1/volumes"

    API_KEY = os.getenv("GOOGLE_API_KEY")

    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key não encontrada no ambiente.")

    filter_q = search_term.strip()
    params = {
        "q": filter_q,
        "orderBy": "relevance",
        "projection": "full",
        "maxResults": 20,
        "key": API_KEY
    }

    response = req.get(BASE_URL, params=params)

    if response.status_code != 200:
        error_message = response.json().get('error', {}).get('message', 'Erro desconhecido')
        raise HTTPException(status_code=response.status_code, detail=f"Erro na solicitação: {error_message}")
    
    try:
        response_data = response.json()

        if "items" not in response_data:
            raise HTTPException(status_code=404, detail="Nenhum livro encontrado.")

        items = pd.json_normalize(response_data["items"], sep="_")

        select_data = [
            "id",
            "volumeInfo_title", "volumeInfo_authors", "volumeInfo_pageCount",
            "volumeInfo_imageLinks_thumbnail", "volumeInfo_averageRating", "volumeInfo_language"
        ]

        filtered_data = items.reindex(columns=select_data, fill_value="N/A").fillna("N/A")

        data_book_dicts = filtered_data.to_dict('records')

        data = [SearchBookSchema(**{
            key: (None if value == "N/A" else value) for key, value in row.items()
        }) for row in data_book_dicts]
        
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar os dados: {str(e)}")
def get_book(id : str) -> BookSchema:
    url = f"https://www.googleapis.com/books/v1/volumes/{id}"
    response = req.get(url)

    if response.status_code != 200:
        error_message = response.json().get("error", {}).get("message", "Erro desconhecido")
        raise HTTPException(status_code=response.status_code, detail=f"Erro ao buscar livro: {error_message}")

    data = response.json()
    volume_info = data.get("volumeInfo", {})

    #TODO: mudar esse modelo de dados
    book_data = {
        "title": volume_info.get("title", "N/A"),
        "authors": volume_info.get("authors", []),
        "publisher": volume_info.get("publisher", "N/A"),
        "description": volume_info.get("description", "N/A"),
        "publishedDate": volume_info.get("publishedDate", "N/A"),
        "pageCount": volume_info.get("pageCount"),
        "categories": volume_info.get("categories", []),
        "imageLinks_large": volume_info.get("imageLinks", {}).get("large"),
        "language": volume_info.get("language", "N/A"),
        "industryIdentifiers": volume_info.get("industryIdentifiers", []),
    }

    return BookSchema(**book_data)
