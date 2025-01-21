import requests as req
import pandas as pd


 
def test_search(target_book):
    origins = [
        "https://openlibrary.org/search.json"
    ]
    response = req.get(f"{origins[0]}?q={target_book}").json()

    data = pd.json_normalize(response['docs'], sep='_')

    expected_columns = [
        "title", "author_name", "author_key", "first_publish_year",
        "number_of_pages_median", "cover_edition_key", "isbn", "seed"
    ]

    for col in expected_columns:
        if col not in data.columns:
            data[col] = None 

    data = data[expected_columns]

    data["isbn"] = data["isbn"].apply(lambda x: x[0:1] if isinstance(x, list) and len(x) > 0 else None)
    data["seed"] = data["seed"].apply(lambda x: x[0:1] if isinstance(x, list) and len(x) > 0 else None)

    data.to_csv(f'./books_api/tests_api/{target_book}_data.csv', index=False)

    return data["title"], data["cover_edition_key"]