import requests as req
import pandas as pd 
from pydantic import BaseModel
from typing import List

origins = [
    "http://api.weatherapi.com/v1/forecast.json"
]
api_key = "356bd35e90fe467483b00924251301"

class WeatherForecast(BaseModel):
    date: str
    day_maxtemp_c: float
    day_mintemp_c: float
    day_maxwind_kph: float
    day_daily_chance_of_rain: int
    day_avghumidity: float
    day_condition_text: str
    day_condition_icon: str
    astro_moon_phase: str
    astro_moon_illumination: int
class Location(BaseModel):
    name: str
    country: str
    region: str
    lat: float
    lon: float
    forecasts : List[WeatherForecast] | None

target_city = "Euclides da Cunha"

response = req.get(f"{origins[0]}?key={api_key}&q={target_city}&aqi=no&days=7&lang=pt&alerts=no").json() # request dos dados para api

# seleção de dados relevantes
data_location = pd.json_normalize(response['location'], sep='_')[['name', 'country', 'region', 'lat', 'lon']]
data_forecast = pd.json_normalize(response['forecast']['forecastday'], sep='_')[[
    'date',
    'day_maxtemp_c',
    'day_mintemp_c',
    'day_maxwind_kph',
    'day_daily_chance_of_rain',
    'day_avghumidity',
    'day_condition_text',
    'day_condition_icon',
    'astro_moon_phase',
    'astro_moon_illumination'
]]



# transformação de dados em models
forecasts =  [WeatherForecast(**row) for row in data_forecast.to_dict('records')]

location_weather = Location(**data_location.to_dict('records')[0])
location_weather.forecasts = forecasts

print(location_weather)

