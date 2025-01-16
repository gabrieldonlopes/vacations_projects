import pandas as pd 
from pydantic import BaseModel
from typing import List

# models para tratamento e veriificação de dados
class WeatherForecast(BaseModel):
    date: str
    day_maxtemp_c: float
    day_mintemp_c: float
    day_condition_icon: str
class Location(BaseModel):
    name: str
    country: str
    region: str
    lat: float
    lon: float
    localtime : str
    temp_c : float
    wind_kph : float
    precip_mm : float
    humidity : float
    feelslike_c : float
    condition_text : str
    condition_icon : str
    forecasts : List[WeatherForecast] | None

def data_handle(data):
    # seleção e filtragem de dados
    data_current = pd.json_normalize(data['current'], sep='_')[['temp_c', 'wind_kph', 'precip_mm','humidity','feelslike_c','condition_text','condition_icon']]
    data_location = pd.json_normalize(data['location'], sep='_')[['name', 'country', 'region', 'lat', 'lon', 'localtime']]
    data_forecast = pd.json_normalize(data['forecast']['forecastday'], sep='_')[[
        'date',
        'day_maxtemp_c',
        'day_mintemp_c',
        'day_condition_icon',
    ]]

    # junção de dados em um dataframe
    data_location = pd.concat([data_location, data_current], axis=1)

    # transformação de dados em dicionarios
    data_location_dict = data_location.to_dict('records')[0]
    data_forecast_dicts = data_forecast.to_dict('records')
    
    # transformação dos dados em models
    location_weather = Location(**data_location_dict, forecasts=[])
    forecasts = [WeatherForecast(**row) for row in data_forecast_dicts]

    # adição do forecasts ao model principal
    location_weather.forecasts = forecasts  

    return location_weather

