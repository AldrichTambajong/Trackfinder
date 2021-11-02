import React from 'react'
import { useState } from 'react'
function Index(props) {
    const [artist, setArtist] = useState('')

    function submit(e) {
        e.preventDefault()
        let artistName = {
            'artist': artist,
            'email': props.email
        }
        console.log(artistName)
        fetch('/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artistName)
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.status === 200) {
                    // Sets state variables used in Song component and respective session variables
                    props.setArtistName(data.artistName)
                    sessionStorage.setItem('artistName', data.artistName)
                    props.setArtistImg(data.artistImg)
                    sessionStorage.setItem('artistImg', data.artistImg)
                    props.setSongName(data.songName)
                    sessionStorage.setItem('songName', data.songName)
                    props.setSongUrl(data.songUrl)
                    sessionStorage.setItem('songUrl', data.songUrl)
                    props.setSongImg(data.songImg)
                    sessionStorage.setItem('songImg', data.songImg)
                    props.setAlbumName(data.albumName)
                    sessionStorage.setItem('albumName', data.albumName)
                    props.setLyrics(data.lyrics)
                    sessionStorage.setItem('lyrics', data.lyrics)
                    props.setSavedArtist(data.playlist)
                    sessionStorage.setItem("savedArtist", JSON.stringify(data.playlist))
                    props.setArtistPresent(sessionStorage.getItem("artistPresent"))
                    sessionStorage.setItem('artistPresent', true)
                }
            })
    }

    return (
        <div>
            <div className="navbar">
                {/*Logout clears all session variables, forcing App.js to redirect to login,
                href link means nothing, just needed it for eslint to not give me error */}
                <a href="google.com" onClick={() => { sessionStorage.clear() }}>Logout</a>
                <h1 className="title">Trackfinder</h1>
            </div>

            <div className="indexTitle">
                <h1 class="headTitle">Welcome to Trackfinder {props.name}!</h1>
                <h2 class="headTitle">Here you can find information on an artist and listen to a hit song of theirs!</h2>
            </div>

            <div className="searchbarDiv">
                <h2>To start, enter an artist's name in the box:</h2>
                <div className="searchbar">
                    <form method="POST" onSubmit={(e) => submit(e)}>
                        <input type="text" name="artist" placeholder="Search for an artist" value={artist}
                            onChange={e => setArtist(e.target.value)} />
                        <div></div>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Index
