import React from 'react'

function Song(props) {
    function addArtist(e) {
        e.preventDefault()
        let artistInfo = {
            'artist': props.artistName,
            'email': props.email
        }
        console.log(artistInfo)
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artistInfo)
        })
            .then(response => response.json())
            .then((data) => {
                // Displays error message if json response's error field returns true
                if (data.error === 'true') {
                    alert("Artist already saved in your playlist!")
                }
                else {
                    console.log(data)
                    props.setSavedArtist(data.list)
                }
            })
    }
    return (
        <div className="song">
            <div className="songWhole">
                <div className="songHeadDetails">
                    <div className="songInfoDiv">
                        <h2 className="songDetails">{props.songName}</h2>
                        <h3 className="songDetails">by {props.artistName}</h3>
                        <img src={props.artistImg} className="songArtist" alt="" />
                        <form method="POST" name="save" onSubmit={(e) => { addArtist(e) }}>
                            <input type="submit" value="Save Artist" />
                        </form>
                    </div>
                </div>
                <div className="songImgDiv">
                    <img src={props.songImg} className="songImg" alt="" />
                    <h1 className="songDetails">{props.albumName}</h1>
                </div>
            </div>
            <div className="spotifyPlayer">
                <iframe src={"https://open.spotify.com/embed/track/" + props.songUrl} className="spotifyPlayer" frameBorder="0"
                    allowfullscreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="spotifyPlayer"></iframe>
            </div>
            <div className="lyricsDiv">
                <a className="center" href={props.lyrics} > Click here for song lyrics </a>
                {/* <a className="center" href="artistBio" >Click Here for more information</a> */}
            </div>
        </div>
    )
}

export default Song
