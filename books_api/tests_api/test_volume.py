import requests as req
import pandas as pd
from schemas import BookSchema


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
    b = BookSchema(**filtered_data.to_dict('records')[0])
    print(b)

get_book("https://www.googleapis.com/books/v1/volumes/hiYvrMLIh9oC")