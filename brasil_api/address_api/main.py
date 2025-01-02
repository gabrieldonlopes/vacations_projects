from fastapi import FastAPI
import requests as req
app = FastAPI()

BASE_URL = "https://brasilapi.com.br/api/cep/v1/"

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/address/{cep}")
async def address(cep):
    response = req.get(f"{BASE_URL}{cep}")
    if response.status_code == 200:
        address = response.json()
    else:
        return {"error": "CEP not found"}
    return address
