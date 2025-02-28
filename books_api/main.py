import uvicorn
import argparse
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import auth
from backend.routers import user    
from backend.routers import bookShelf
from backend.database import create_tables

app = FastAPI(debug=True)

origins = [
    "http://localhost:5173",
    "https://www.googleapis.com/books/v1/volumes"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(bookShelf.router, prefix="/bookshelf")

async def initialize_db(create_db: bool):
    if create_db:
        await create_tables()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--create-db",
        action="store_true",
        help="Cria o banco de dados e as tabelas necessárias."
    )
    parser.add_argument(
        "--run-server",
        action="store_true",
        help="Inicia o servidor Uvicorn."
    )
    args = parser.parse_args()

    if args.create_db:
        asyncio.run(initialize_db(args.create_db))

    if args.run_server:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=True)