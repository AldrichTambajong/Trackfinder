import requests
import os
import random
from dotenv import load_dotenv
from random import randint

# .env location
load_dotenv("/Users/aldricht/ComputerScience/SoftwareEngineering/Proj1/BackEnd/key.env")

# All url's used for authorization or api calling
url = "https://accounts.spotify.com/api/token"
geniusApiUrl = "https://api.genius.com/oauth/authorize"
base_url = "https://api.spotify.com/v1/"
genius_url = "http://api.genius.com/"

# params for post
clientId = os.getenv("CLIENT_ID")
clientSecret = os.getenv("CLIENT_SECRET")
geniusClientId = os.getenv("GENIUS_CLIENT_ID")
geniusClientSecret = os.getenv("GENIUS_CLIENT_SECRET")

# Param for spotify
data = {
    "grant_type": "client_credentials",
    "client_id": clientId,
    "client_secret": clientSecret,
    "response_type": "code",
}

# Obtaining access token for spotify
response = requests.post(url, data=data)

authOSpotify = {
    "Authorization": "Bearer {}".format(response.json().get("access_token"))
}

autoOGenius = {"Authorization": "Bearer {}".format(os.getenv("GENIUS_CLIENT_TOKEN"))}
# global variables for html use(main)
artistName = ""
artistImgUrl = ""
artistID = ""
songName = ""
songUrl = ""
songImgUrl = ""
albumName = ""
geniusLyricsUrl = ""
# global variables for stretch features

# Calls on Artist's Top Tracks Api
def topTrackApi(id):
    songApiEnd = "artists/{}/top-tracks?market=US".format(artistID)
    songApiUrl = "".join([base_url, songApiEnd])
    return requests.get(songApiUrl, headers=authOSpotify)


# Search for Item Api to obtain artist ID, artist name, and the url for the artist's
# image from search bar
def searchForItemApi(name):
    global artistImgUrl, artistName, artistID

    nameConfig = ""  # variable to change input name to correct format for API
    if " " in name:
        nameConfig = name.replace(" ", "%20")
    else:
        nameConfig = name

    searchApiEnd = "search/?q={}&type=artist&market=US".format(nameConfig)
    searchUrl = "".join([base_url, searchApiEnd])
    searchRes = requests.get(searchUrl, headers=authOSpotify)
    artistLists = searchRes.json()["artists"]["items"]
    for artists in artistLists:
        if (
            artists["name"].lower() == name.lower()
            and artists["popularity"] > 10
            and len(artists["images"]) != 0
        ):
            artistName = artists["name"]
            artistID = artists["id"]
            artistImgUrl = artists["images"][0]["url"]


# Obtains song preview,song image,song name, and album name from artist id
def randomTopTrack(id):
    global songUrl, songImgUrl, songName, albumName

    urlList = topTrackApi(id).json()["tracks"]
    randomValue = randint(0, len(urlList) - 1)
    if urlList[randomValue]["id"] != "None":
        songUrl = urlList[randomValue]["id"]
        songImgUrl = urlList[randomValue]["album"]["images"][0]["url"]
        songName = urlList[randomValue]["name"]
        albumName = urlList[randomValue]["album"]["name"]
    else:
        songUrl = urlList[randomValue]["id"]
        songImgUrl = urlList[randomValue]["album"]["images"][0]["url"]
        songName = urlList[randomValue]["name"]
        albumName = urlList[randomValue]["album"]["name"]


# Obtains song lyrics from genius' search api
def getSongLyrics(songTitle):
    global geniusLyricsUrl

    searchUrlG = genius_url + "search"

    params = {"q": songTitle}

    responseG = requests.get(searchUrlG, params=params, headers=autoOGenius)
    lyricsList = responseG.json()["response"]["hits"]
    # Performs 3 checks:
    # -check if artistname is mentioned anywhere in primary artists
    # -check if artist name is mentioned in song title with featured artists
    # -check if title_with_featured is a subset string of the song name from spotify
    for hits in lyricsList:
        if (
            set(artistName).issubset(hits["result"]["primary_artist"]["name"]) == True
            or set(artistName).issubset(hits["result"]["title_with_featured"]) == True
            or set(hits["result"]["title_with_featured"]).issubset(songName)
        ):

            geniusLyricsUrl = hits["result"]["url"]
            break


# -------------------------------------Stretch Feature Methods-------------------------------------


def getAllTopTracks(id):
    allTracks = topTrackApi(id).json()["tracks"]
    allTopTracks = []

    for tracks in allTracks:
        allTopTracks.append(tracks["name"])

    return allTopTracks


# Method calls to test results in terminal without running flask
# app
# searchForItemApi("dj khaled")
# print(artistID)
# randomTopTrack(artistID)
# getSongLyrics(songName)
# print(artistName, "\n",songName,"\n",artistImgUrl)
