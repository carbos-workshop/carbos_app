from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token

import sys
import psycopg2
import geopandas as gpd
#from shapely.geometry import Polygon, Point
#from geopandas.geoseries import GeoSeries

#from application.data_scraper.boulder import get_parcel_data, get_tree_data, get_building_data
#from application.data_scraper.encoderz import my_encoder


try:
    conn = psycopg2.connect("dbname='carbos' user='gocoder' host='localhost' password='gocoder2018'")
    cur = conn.cursor()
except:
    print('[Error] - app.py - connecting to database.')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403


@app.route("/api/owner-city", methods=["GET"])
def owner_city():
    incoming = request.get_json()
    #incoming = {'owner_name': 'Stoltzman', 'owner_city': '80526'} test case :)
    print(str(incoming), file=sys.stderr)
    owner_name = str(incoming['owner_name']).upper()
    owner_city = str(incoming['owner_city']).upper()
    qry = """SELECT situsadd AS Address, sitaddcty AS City, LEFT(sitaddzip, 5) As Zipcode, parcel_id AS Parcel FROM parcels WHERE sitaddzip LIKE '%%' || %s || '%%' AND owner LIKE  '%%' || %s || '%%' LIMIT 50;"""
    cur.execute(qry, (owner_city, owner_name))
    rows = cur.fetchall()
    output = {}
    output['result'] = len(rows)
    if rows:
        for row in rows:
            output[row[3]] = "{}, {}, {}".format((row[0],row[1],row[2]))
        return jsonify(output)
    else:
        return jsonify(output)


@app.route("/api/owner-address", methods=["GET"])
def owner_address():
    incoming = request.get_json()
    # incoming = {'address_id': '250708301106'} for testing
    print(str(incoming), file=sys.stderr)
    address_id = incoming['address_id']
    qry = """SELECT ST_AsGeoJSON(geom) AS Coordinates, ST_Area(geom) AS Sqft FROM parcels WHERE parcel_id=%s;"""
    cur.execute(qry, (address_id,))
    rows = cur.fetchall()
    output = {}
    output['result'] = len(rows)
    if rows:
        data = rows[0]
        output['coordinates'] = data[0].split('"coordinates":')[1].replace('}','').replace('{','')
        output['sqft'] = data[1]
        return jsonify(output)
    else:
        return jsonify(output)


