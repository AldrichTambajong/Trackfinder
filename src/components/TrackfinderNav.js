import React from 'react'
import {useState} from 'react'

function TrackfinderNav(props) {

    const[curArtist,setCurArtist] = useState()
    function submit(e){
        e.preventDefault()
        let artistName = {
            'artist': curArtist,
            'email':props.email
        }
        console.log(artistName)
        fetch('/index',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(artistName)
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if(data.status === 200){
                // Sets state variables used in Song component and respective session variables
                props.setArtistName(data.artistName)
                sessionStorage.setItem('artistName',data.artistName)
                props.setArtistImg(data.artistImg)
                sessionStorage.setItem('artistImg',data.artistImg)
                props.setSongName(data.songName)
                sessionStorage.setItem('songName',data.songName)
                props.setSongUrl(data.songUrl)
                sessionStorage.setItem('songUrl',data.songUrl)
                props.setSongImg(data.songImg)
                sessionStorage.setItem('songImg',data.songImg)
                props.setAlbumName(data.albumName)
                sessionStorage.setItem('albumName',data.albumName)
                props.setLyrics(data.lyrics)
                sessionStorage.setItem('lyrics',data.lyrics)
                props.setSavedArtist(data.playlist)
                sessionStorage.setItem("savedArtist",JSON.stringify(data.playlist))
                props.setArtistPresent(sessionStorage.getItem("artistPresent"))
                sessionStorage.setItem('artistPresent',true)
            }
        })
    }

    return (
        <div className = "navbar">
            <h1 className="title">Trackfinder</h1>
            <div className="login-container">
                <form method="POST" className="indexForm" onSubmit={(e) => submit(e)}>
                    <input type="text" name="search" placeholder="Search for an artist" value={curArtist} 
                    onChange={(e) => setCurArtist(e.target.value)} />
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        </div>
    )
}

export default TrackfinderNav
