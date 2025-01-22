from fastapi.responses import JSONResponse
import uvicorn
from fastapi import FastAPI
from  fastapi.middleware.cors import CORSMiddleware
import requests as req
from data_handle import data_handle, Location, WeatherForecast

import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

origins = [
    "http://api.weatherapi.com/v1/forecast.json",
    "http://localhost:5173"
]
api_key = os.getenv("WEATHER_API_KEY")

# controla quem tem acesso a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "Location not found. Please try other location."}
    )

@app.get("/weather/{location}", response_model=Location)
async def weather(location):

    location.replace(" ", "%20")
    url = f"{origins[0]}?key={api_key}&q={location}&aqi=no&days=7&lang=pt&alerts=no"

    # TODO: mudar abordagem
    response = req.get(url) # chamada da weather api 
    
    if response.status_code == 200:
        data_model = data_handle(response.json())
        return data_model
    else:
        raise Exception("Location not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
