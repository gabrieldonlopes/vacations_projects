import pandas as pd
import requests as req
from fastapi import HTTPException

import os
from dotenv import load_dotenv
load_dotenv()

from ..schemas import SearchBookShelf, BookSchema

def search_book_shelf(search_term: str):

    # ler a API_KEY do arquivo .env

    BASE_URL = "https://www.googleapis.com/books/v1/volumes"

    API_KEY = os.getenv("GOOGLE_API_KEY")

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
        raise HTTPException(f"Erro na solicitação: {response.status_code}. {response.json().get('error', {}).get('message', 'Erro desconhecido')}")

    try:
        response_data = response.json()
        if "items" not in response_data:
            print("Nenhum livro encontrado para o termo de busca.")
            exit()

        items = pd.json_normalize(response_data["items"], sep="_")

        select_data = [
            "id","selfLink",
            "volumeInfo_title", "volumeInfo_authors","volumeInfo_pageCount",
            "volumeInfo_imageLinks_thumbnail", "volumeInfo_averageRating", "volumeInfo_language"
        ]


        filtered_data = items.reindex(columns=select_data, fill_value="N/A")

        return SearchBookShelf(**filtered_data.to_dict('records')[0])

    except Exception as e:
        raise

def get_book(self_link):
    request = req.get(self_link)
    response = request.json()
    if request.status_code != 200:
        return None
    select_data = [
        "title", "authors", "publisher","description",
        "publishedDate", "pageCount", "categories",
        "imageLinks_large","language","industryIdentifiers"
    ]

    book_data = pd.json_normalize(response["volumeInfo"], sep="_")[select_data]
    filtered_data = book_data.reindex(columns=select_data, fill_value="N/A")
    #filtered_data.to_csv("Jack London_data.csv", index=False)
    book = BookSchema(**filtered_data.to_dict('records')[0])
    return book