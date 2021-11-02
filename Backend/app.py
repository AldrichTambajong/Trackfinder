import flask
import os
from flask import json
from flask.json import jsonify
from dotenv import load_dotenv

load_dotenv(
    "/Users/aldricht/ComputerScience/SoftwareEngineering/react_proj/Backend/.env"
)

import apiCalls
from flask_login import current_user, LoginManager, login_user, logout_user
from models import *
from datetime import timedelta
from sqlalchemy import func

app = flask.Flask(__name__, static_folder="../build")
uri = os.getenv("SECRET_KEY")
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = uri  # Allows for user login
app.config["REMEMBER_COOKIE_DURATION"] = timedelta(days=1)
app.config["USE_SESSION_FOR_NEXT"] = True

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


@app.route("/login", methods=["GET", "POST"])
def login():
    if flask.request.method == "POST":
        data = flask.request.get_json()
        emailValid = User.query.filter_by(email=data.get("email")).first()
        if emailValid and emailValid.password == data.get("password"):
            jsonData = {
                "email": data.get("email"),
                "password": data.get("password"),
                "name": emailValid.firstName,
                "login": "valid",
                "status": 200,
            }
            return jsonify(jsonData)
        else:
            jsonData = {"status": "invalid"}
            return flask.jsonify(jsonData)


@app.route("/signUp", methods=["POST"])
def signUp():
    if flask.request.method == "POST":
        data = flask.request.get_json()
        firstName = data.get("firstName")
        lastName = data.get("lastName")
        email = data.get("email")
        password = data.get("password")

        if User.query.filter_by(email=email).first():
            errorObj = {"message": "Email already exists!", "status": 300}
            return jsonify(errorObj)
        elif User.query.filter_by(password=password).first():
            errorObj = {"message": "Password is already taken", "status": 300}
            return jsonify(errorObj)

        new_account = User(firstName, lastName, email, password)
        db.session.add(new_account)
        db.session.commit()
        successObj = {"message": "New user registered", "status": 200}
        return jsonify(successObj)


@app.route("/index", methods=["GET", "POST"])
def index():
    if flask.request.method == "POST":
        # Collects all info for searched artist and user's saved artists to display
        # on page
        data = flask.request.get_json()
        savedArtistArr = []
        savedArtists = favArtists.query.filter_by(accountEmail=data.get("email"))
        for objects in savedArtists:
            savedArtistArr.append(objects.artistName)
        print(json.dumps(savedArtistArr))
        apiCalls.searchForItemApi(data.get("artist"))
        apiCalls.randomTopTrack(apiCalls.artistID)
        apiCalls.getSongLyrics(apiCalls.songName)
        songObj = {
            "artistName": apiCalls.artistName,
            "artistImg": apiCalls.artistImgUrl,
            "songName": apiCalls.songName,
            "songUrl": apiCalls.songUrl,
            "songImg": apiCalls.songImgUrl,
            "albumName": apiCalls.albumName,
            "lyrics": apiCalls.geniusLyricsUrl,
            "playlist": savedArtistArr,
            "status": 200,
        }
        return jsonify(songObj)

@app.route("/loadPlaylist",methods=["POST"])
def loadList():
    data = flask.request.get_json()
    loadArtist =[]
    findArtists = favArtists.query.filter_by(accountEmail=data.get("email"))
    for objects in findArtists:
        loadArtist.append(objects.artistName)
    playlist ={
        "playlist":loadArtist
    }
    return jsonify(playlist)



@app.route("/remove", methods=["POST"])
def remove():
    # Removes artist from respective button on songinfo route
    if flask.request.method == "POST":
        data = flask.request.get_json()
        object = favArtists.query.filter_by(
            accountEmail=data.get("email"), artistName=data.get("artist")
        ).first()
        db.session.delete(object)
        db.session.commit()

        # Returns json object with new array of saved artists of the user
        savedArtistArr = []
        savedArtists = favArtists.query.filter_by(accountEmail=data.get("email"))
        for objects in savedArtists:
            if objects.artistName != data.get("artist"):
                savedArtistArr.append(objects.artistName)
        print(savedArtistArr)
        songObj = {"list": savedArtistArr}
        return jsonify(songObj)


@app.route("/save", methods=["POST"])
def save():
    if flask.request.method == "POST":
        data = flask.request.get_json()
        # Checks to see if artist is in favArtists db
        if favArtists.query.filter_by(artistName=data.get("artist")).first():
            emails = favArtists.query.filter_by(accountEmail=data.get("email"))
            for objects in emails:
                # Returns error message indicator for frontend
                if objects.artistName == data.get("artist"):
                    errorObj = {"error": "true"}
                    return jsonify(errorObj)
            # Adds new artist to favArtists db with user's email, then sends new json
            # data for state variable
            newArtist = favArtists(
                accountEmail=data.get("email"), artistName=data.get("artist")
            )
            db.session.add(newArtist)
            db.session.commit()
            savedArtistArr = []
            savedArtists = favArtists.query.filter_by(accountEmail=data.get("email"))
            for objects in savedArtists:
                savedArtistArr.append(objects.artistName)
            print(savedArtistArr)
            songObj = {"list": savedArtistArr, "error": "false"}
            return jsonify(songObj)

        # Adds new artist if no record is found in favArtists db
        else:
            newArtist = favArtists(
                accountEmail=data.get("email"), artistName=data.get("artist")
            )
            db.session.add(newArtist)
            db.session.commit()
            savedArtistArr = []
            savedArtists = favArtists.query.filter_by(accountEmail=data.get("email"))
            for objects in savedArtists:
                savedArtistArr.append(objects.artistName)
            print(savedArtistArr)
            songObj = {"list": savedArtistArr, "error": "false"}
            return jsonify(songObj)


if __name__ == "__main__":
    app.run(debug=True,  port=int(os.environ.get("PORT", 5000)))
