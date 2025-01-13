import uvicorn
from fastapi import FastAPI
from  fastapi.middleware.cors import CORSMiddleware
import requests as req
from pydantic import BaseModel
app = FastAPI()


origins = [
    "https://brasilapi.com.br/api/cep/v1/",
    "http://localhost:5173",
    ]


# controla quem tem acesso a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class City(BaseModel):
    cep: str
    state: str
    city:  str
    neighborhood: str
    street: str
    service: str


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/address/{cep}", response_model=City)
async def address(cep):
    response = req.get(f"{origins[0]}{cep}")
    if response.status_code == 200:
        return City(**response.json()) 
    else:
        return {"error": "CEP not found"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

