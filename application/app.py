from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token

import sys
import psycopg2
import os

DB_CONNECT = os.environ['DB_CONNECT']

try:
    conn = psycopg2.connect(DB_CONNECT)
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


@app.route("/api/owner-info", methods=["POST"])
def owner_city():
    incoming = request.get_json()
    # incoming = {'owner_name': 'Smith', 'owner_zip': '80526'} #test case
    print(str(incoming), file=sys.stderr)
    owner_name = str(incoming['owner_name']).upper()
    owner_zip = str(incoming['owner_zip']).upper()
    try:
        qry = """SELECT situsadd AS Address, sitaddcty AS City, LEFT(sitaddzip, 5) As Zipcode, parcel_id AS Parcel FROM parcels WHERE sitaddzip LIKE '%%' || %s || '%%' AND owner LIKE  '%%' || %s || '%%' LIMIT 100;"""
        cur.execute(qry, (owner_zip, owner_name))
        rows = cur.fetchall()
        output_list = []
        if rows:
            for row in rows:
                output_dict = {}
                output_dict['id'] = row[3]
                output_dict['address'] = "{}, {}, {}".format(row[0],row[1],row[2])
                output_list.append(output_dict)
            print(str(output_list), file=sys.stderr)
            return jsonify(output_list)
    except Exception as e:
        conn.rollback()
        return jsonify({'result': 'problem'})

    else:
        return jsonify(output_list)


@app.route("/api/owner-address", methods=["POST"])
def owner_address():
    incoming = request.get_json()
    # incoming = {'address_id': '9733105061'} #for testing
    print(str(incoming), file=sys.stderr)
    address_id = incoming['address_id']
    try:
        qry = """SELECT ST_AsText(ST_FlipCoordinates(ST_Transform(parcels.geom, 4326))) AS Coordinates, ST_Area(parcels.geom) AS Sqft, ruca as Ruca FROM parcels LEFT JOIN ruca ON ST_Intersects(parcels.geom, ruca.geom) WHERE parcel_id=%s;"""
        cur.execute(qry, (address_id,))
        rows = cur.fetchall()

        output = {}
        if rows:
            data = rows[0]
            tmp = data[0].split('MULTIPOLYGON(((')[1].replace(')','').replace('(','')
            tmp2 = '[' + tmp.replace(',','],[').replace(' ', ',') + ']'
            tmp3 = tmp2.replace('[', '').split('],')
            tmp4 = []
            for s in tmp3:
                tmp5 = map(float, s.replace(']','').split(','))
                tmp4.append(list(tmp5))
            tmp4 = [map(float, s.replace(']','').split(',')) for s in tmp3]
            output['coordinates'] = tmp2
            output['sqft'] = data[1]
            if data[2]:
                output['ruca'] = float(data[2])
            else:
                output['ruca'] = 1 # No information will provide lowest possible outcome
            output['carbon_index'] = (11-float(data[2])) * data[1] # (11 - ruca) is because 1-10 scale of ruca is reversed
            print(str(output), file=sys.stderr)
            return jsonify(output)
    except Exception as e:
        conn.rollback()
        return jsonify({'result': 'problem'})

    else:
        return jsonify(output)
