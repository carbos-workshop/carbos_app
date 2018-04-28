import json
import requests

# Boulder parcel data
def get_parcel_data():

    # Data is in GeoJSON format
    url = "https://www-static.bouldercolorado.gov/docs/opendata/Parcels.GeoJSON?_ga=2.17042553.1507132045.1524847957-674020513.1524847957"
    response = requests.get(url)

    if response.status_code != 200:
        print('Error with request to boulder parcel data')
        print('Error was ' + str(response.status_code))
    else:
        data = response.json()

    features = data['features'] # list of dictionariesf
    properties = [feature['properties'] for feature in features] #list of dictionaries

    return properties

#TODO: add geometry (parcel is properties only)


def get_tree_data():

    # Dat ais in GeoJSON format
    url = "https://www-static.bouldercolorado.gov/docs/opendata/Trees_Public.GeoJSON?_ga=2.52576744.1507132045.1524847957-674020513.1524847957"
    response = requests.get(url)

    if response.status_code != 200:
        print('Error with request to boulder parcel data')
        print('Error was ' + str(response.status_code))
    else:
        data = response.json()

    features = data['features']  # list of dictionariesf
    properties = [feature['properties'] for feature in features]  # list of dictionaries

    return properties


