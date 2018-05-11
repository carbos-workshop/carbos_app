from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token

import psycopg2
import sys
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


@app.route("/api/test_get", methods=["GET", "POST"])
def test_get():
    incoming = request.get_json()
    print(str(incoming), file=sys.stderr)
    return jsonify(incoming)


@app.route("/api/test_post", methods=["POST"])
def test_post():
    incoming = request.get_json()
    i_city,i_owner = incoming['message'].split(',')
    i_owner = "%" + str(i_owner) + "%"
    qry = f"""SELECT DISTINCT(parcels.owner) as Owner, SUM(parcels.shape_area) as Area FROM parcels WHERE sitaddcty=('{str(i_city)}') AND owner LIKE ('{str(i_owner)}') GROUP BY Owner LIMIT 50"""
    print(str(incoming['message']), file=sys.stderr)
    print(qry ,file=sys.stderr)
    cur.execute(qry)
    rows = cur.fetchall()
    print(str(rows), file=sys.stderr)
    if rows:
        return jsonify(rows)
    else:
        return 'Nothing Found'

