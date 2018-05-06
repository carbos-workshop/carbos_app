from index import db, bcrypt
import web3
from geoalchemy2.types import Geometry


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    wallet = db.Column(db.String(255))

    def __init__(self, email, password):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)

        w = web3.Web3()
        self.wallet = w.personal.newAccount('scott-is-awesome')

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None


class ParcelProperties(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    ASR_ID = db.Column(db.String(255))
    AREASQFT = db.Column(db.Integer())
    ADDRESS = db.Column(db.String(255))
    PARCEL_ID = db.Column(db.String(255))
    geom = db.Column(Geometry(geometry_type='POLYGON', srid=4326))


class TreeProperties(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    UNIQUEID = db.Column(db.String(255))
    ADDRESS = db.Column(db.String(255))
    geom = db.Column(Geometry(geometry_type='POINT', srid=4326))


class BuildingProperties(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    DEMAVGELEV = db.Column(db.Integer())
    DSMAVGELEV = db.Column(db.Integer())
    AVGHEIGHT = db.Column(db.Integer())
    DEMLOWELEV = db.Column(db.Integer())
    DSMHIGELVE = db.Column(db.Integer())
    HIGHHEIGHT = db.Column(db.Integer())
    SHAPE_AREA = db.Column(db.Float())
    SHAPE_LEN = db.Column(db.Float())
    geom = db.Column(Geometry(geometry_type='POLYGON', srid=4326))

