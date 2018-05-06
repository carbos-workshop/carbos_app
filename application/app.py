from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, ParcelProperties, TreeProperties, BuildingProperties
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
import re

from application.data_scraper.boulder import get_parcel_data, get_tree_data, get_building_data
from application.data_scraper.encoderz import my_encoder


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


@app.route("/scrape_parcels", methods=["GET"])
def scrape_the_parcels():
    data = get_parcel_data()
    for row in data:
        geom = 'POLYGON' + '(' + str(tuple(row['geometry'])).replace(',', '').replace('[', '').replace(']', ',') + ')'
        geom = re.sub('\,+', ',', geom).rstrip(',')
        parcel = ParcelProperties()
        parcel.ASR_ID = row['ASR_ID']
        parcel.PARCEL_ID = row['PARCEL_ID']
        parcel.AREASQFT = row['AREASQFT']
        parcel.ADDRESS = row['ADDRESS']
        parcel.geom_hash = my_encoder(geom)
        parcel.geom = geom
        db.session.add(parcel)
    db.session.commit()
    return 'Parcel data loaded'


@app.route("/scrape_trees", methods=["GET"])
def scrape_the_trees():
    data = get_tree_data()
    for row in data:
        geom = 'SRID=4326;' + 'POINT' + str(tuple(row['geometry'])).replace(',','')
        tree = TreeProperties()
        tree.ADDRESS = row['ADDRESS']
        tree.UNIQUEID = row['UNIQUEID']
        tree.geom_hash = my_encoder(geom)
        tree.geom = geom
        db.session.add(tree)
    db.session.commit()
    return 'Tree data loaded'


@app.route("/scrape_buildings", methods=["GET"])
def scrape_the_buildings():
    data = get_building_data()
    for row in data:
        geom = 'POLYGON' + '(' + str(tuple(row['geometry'])).replace(',', '').replace('[', '').replace(']', ',') + ')'
        geom = re.sub('\,+', ',', geom).rstrip(',').replace(',)',')')
        building = BuildingProperties()
        building.DEMAVGELEV = row['DEMAVGELEV']
        building.DSMAVGELEV = row['DSMAVGELEV']
        building.AVGHEIGHT = row['AVGHEIGHT']
        building.DEMLOWELEV = row['DEMLOWELEV']
        building.DSMHIGELVE = row['DSMHIGELVE']
        building.HIGHHEIGHT = row['HIGHHEIGHT']
        building.SHAPE_AREA = row['SHAPE_AREA']
        building.SHAPE_LEN = row['SHAPE_LEN']
        building.geom_hash = my_encoder(geom)
        building.geom = geom
        db.session.add(building)
    db.session.commit()
    return 'Building data loaded'


