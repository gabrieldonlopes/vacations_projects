import requests
from test_search import test_search

target_book = test_search(input("digite o livro que deseja procurar: "))

titles,covers = test_search(target_book)
for title, cover in zip(titles, covers):
    image_url = f"https://covers.openlibrary.org/b/olid/{cover}-L.jpg"
    if cover == None:
        continue
    output_path = f"books_api/tests_api/cover_{title}.jpg"

    try:
        response = requests.get(image_url, stream=True)
        
        if response.status_code == 200:
            with open(output_path, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f"Imagem salva como: {output_path}")
        else:
            print(f"Erro ao baixar a imagem. Status code: {response.status_code}")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")
