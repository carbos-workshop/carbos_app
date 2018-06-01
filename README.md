# Carbos #

### Data

##### 22 separate parcels from the Colorado Information Marketplace were used from:
https://gisftp.colorado.gov/#/State%20Data/OIT-GIS/ColoradoData/Land%20Ownership/PublicParcels2017/
  - Used in geospatial database (PostGIS)
  - Ensures no overlap occurs between registered pieces of land
  - Verifies land ownership
  - Currently covers 22 counties in CO
  - Used in calculation of square footage of property


##### Rural Urban Commuting Area Codes (RUCA)
https://demography.dola.colorado.gov/CO_RUCA/
  - Used in geospatial database (PostGIS)
  - Determines RUCA value within land being registered
  - Aides in carbon calculation
  - Provides an example as one of many features which can be added to help carbon indexing


### Back end Flask (Python) Server
The Flask server interacts with the database for:
  - User registration
    - Unique username / email registration
    - Encrypted password (using bcrypt)
  - Parcel identification
    - Owner name and zipcode are looked up to provide a list of addresses
    - Once an address is located, the `parcel_id` will return the `MULTIPOLYGON` coordinates
  - Carbon index calculation
    - Parcel coordinates are spatially joined with RUCA data
    - Square footage is calculated and RUCA values taken into account
    - If RUCA data not found, it cannot add value to the calculation





