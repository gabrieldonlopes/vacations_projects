import requests as req
import pandas as pd 

origins = [
    "http://api.weatherapi.com/v1/current.json"
]
api_key = [
    "356bd35e90fe467483b00924251301"
]

target_ciy = "Euclides da Cunha"

response = req.get(f"{origins[0]}?key={api_key[0]}&q={target_ciy}&aqi=no").json()

data_location = pd.json_normalize(response['location'], sep='_')
data_current = pd.json_normalize(response['current'], sep='_')

data_current_selected = data_current[['temp_c', 'wind_kph', 'precip_mm','humidity','feelslike_c','condition_text','condition_icon']]
data_location_selected = data_location[['name', 'country', 'region', 'lat', 'lon']]


df = pd.concat([data_location_selected, data_current_selected], axis=1)

df.to_csv(f'{target_ciy}_data.csv', index=False)