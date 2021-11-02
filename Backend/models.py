from enum import unique
import sys

sys.path.append("/Users/aldricht/ComputerScience/SoftwareEngineering/Proj1")
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(80), unique=False, nullable=False)
    lastName = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

    # String return statement whenever current_user is printed
    def __repr__(self):
        return "<User:{} {}, Email:{}>".format(
            self.firstName, self.lastName, self.email
        )

    # Constructor method for User
    def __init__(self, firstName, lastName, email, password):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password

    def is_active(self):
        return True

    def is_authenticated(self):
        return True

    def get_id(self):
        return str(self.id)


class favArtists(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    accountEmail = db.Column(db.String(100), unique=False, nullable=False)
    artistName = db.Column(db.String(100), unique=False, nullable=False)

    def __init__(self, accountEmail, artistName):
        self.accountEmail = accountEmail
        self.artistName = artistName
