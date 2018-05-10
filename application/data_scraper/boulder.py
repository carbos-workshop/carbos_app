import json
import requests
import pandas as pd
import geopandas as gpd

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

    features = data['features'] # list of dictionaries

    output_data = []
    for feature in features:
        properties = feature['properties']
        properties['geometry'] = feature['geometry']['coordinates']
        output_data.append(properties)

    return output_data

#TODO: add geometry (parcel is properties only)


def get_tree_data():

    # Data is in GeoJSON format
    url = "https://www-static.bouldercolorado.gov/docs/opendata/Trees_Public.GeoJSON?_ga=2.52576744.1507132045.1524847957-674020513.1524847957"
    response = requests.get(url)

    if response.status_code != 200:
        print('Error with request to boulder parcel data')
        print('Error was ' + str(response.status_code))
    else:
        data = response.json()

    features = data['features']  # list of dictionaries

    output_data = []
    for feature in features:
        properties = feature['properties']
        properties['geometry'] = feature['geometry']['coordinates']
        output_data.append(properties)

    return output_data


def get_building_data():

    # Data is in GeoJSON format
    url = "https://www-static.bouldercolorado.gov/docs/opendata/BuildingFootprints.GeoJSON?_ga=2.17976185.1507132045.1524847957-674020513.1524847957"
    response = requests.get(url)

    if response.status_code != 200:
        print('Error with request to boulder parcel data')
        print('Error was ' + str(response.status_code))
    else:
        data = response.json()

    features = data['features']  # list of dictionaries

    output_data = []
    for feature in features:
        properties = feature['properties']
        properties['geometry'] = feature['geometry']['coordinates']
        output_data.append(properties)

    return output_data


def get_tree_species_data():

    # Data is in csv format
    # data is on data.world
    trees = pd.read_csv('https://query.data.world/s/fwc6q3keo7tf77en5chin4r2ljehfu')




#colorado population
#https://gis.dola.colorado.gov/capi/geojson?limit=99999&db=acs1216&schema=data&table=b01003&sumlev=140&type=json&state=8

#df = gpd.GeoDataFrame(data['features'])
#df.to_sql()
#from sqlalchemy import create_engine
#engine = create_engine('postgresql://gocoder:gocoder2018@localhost:5432/carbos')
#from geoalchemy2 import WKTElement, Geometry

#data = get_building_data()
#df = gpd.GeoDataFrame(data)
#geodataframe = df
#geodataframe['geom'] = geodataframe['geometry'].apply(lambda x: WKTElement(x.wkt))
#geodataframe = geodataframe.head(1)
#geodataframe.to_sql('poly_data', engine, if_exists='append', index=False, dtype={'geom': Geometry('POLYGON'))


from geoalchemy2 import Geometry, WKTElement
from sqlalchemy import create_engine

engine = create_engine('postgresql://gocoder:gocoder2018@localhost:5432/carbos')
def create_wkt_element(geom):
    return WKTElement(geom.wkt)

#data = get_building_data()
#geodataframe = gpd.GeoDataFrame(data)

geodataframe = gpd.read_file('public_data/Arapahoe.shp')
#df.to_sql('parcel_polys',con=engine)
geodataframe['geom'] = geodataframe['geometry'].apply(create_wkt_element)
geodataframe = geodataframe.drop(columns=['geometry'])
geodataframe.to_sql('my_polys', engine, if_exists='replace', index=False,
                         dtype={'geom': Geometry('POLYGON')})
