from index import db, bcrypt
import time


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))

    def __init__(self, email, password):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)

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
    PR_NUMBER = db.Column(db.String(255))
    PR_UNIT = db.Column(db.String(255))
    PR_ST_NAME = db.Column(db.String(255))
    PR_ST_MOD = db.Column(db.String(255))
    PR_ZIP = db.Column(db.String(255))
    BLDGSQFT = db.Column(db.Integer())
    # BLDGVALUE = db.Column(db.Float())
    # LANDUNITS = db.Column(db.Float())
    # LANDVALUE = db.Column(db.Float())
    # SUBCOMM = db.Column(db.String(255))
    # BVCPAREA = db.Column(db.String(255))
    # ZONING = db.Column(db.String(255))
    # LANDUSE = db.Column(db.String(255))
    # PREVREVIEW = db.Column(db.String(255))


class TreeProperties(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    UNIQUEID = db.Column(db.String(255))
    ADDRESS = db.Column(db.String(255))


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

