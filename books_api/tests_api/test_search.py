import requests as req
import pandas as pd

BASE_URL = "https://www.googleapis.com/books/v1/volumes"

API_KEY = "AIzaSyCCldi_nevsZ2hEjc2wjCvugcclkPXweYA"

filter_q = input("Digite o termo de busca: ").strip()
params = {
    "q": filter_q,
    "orderBy": "relevance",
    "projection": "full",
    "maxResults": 20,
    "key": API_KEY
}

response = req.get(BASE_URL, params=params)

if response.status_code != 200:
    print(f"Erro na solicitação: {response.status_code}")
    print(response.json().get("error", {}).get("message", "Erro desconhecido"))
    exit()

try:
    response_data = response.json()
    if "items" not in response_data:
        print("Nenhum livro encontrado para o termo de busca.")
        exit()

    items = pd.json_normalize(response_data["items"], sep="_")

    select_data = [
            "id",
            "volumeInfo_title", "volumeInfo_authors","volumeInfo_pageCount",
            "volumeInfo_imageLinks_thumbnail", "volumeInfo_averageRating", "volumeInfo_language"
        ]


    filtered_data = items.reindex(columns=select_data, fill_value="N/A")

    output_file = f"./{filter_q}_data.csv"
    filtered_data.to_csv(output_file, index=False)
    print(f"Dados salvos em: {output_file}")

except Exception as e:
    print(f"Erro ao processar os dados: {e}")
