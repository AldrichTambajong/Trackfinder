import React from 'react'

// Displays playlist in /songInfo route
function Playlist(props) {

    function remove(obj) {
        console.log(obj)
        let artistInfo = {
            'artist': obj,
            "email": props.email
        }
        console.log(artistInfo)
        fetch('/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artistInfo)
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                props.setSavedArtist(data.list)
            })
    }
    return (
        <div className="playlistDiv">
            {props.savedArtist.length === 0 ? /* Displays message if user has nothing saved*/
                <h1 style={{ textAlign: "center" }}> You have nothing saved! Add some Artists!</h1>
                : // Creates table of saved artists if user has saved artists
                <div>
                    <table className="playlistTable">
                        <thead>
                            <tr>
                                <th colSpan="2">Saved Artists</th>
                            </tr>
                        </thead>
                        <tr>
                            <th>Artist:</th>
                            <th>Delete:</th>
                        </tr>
                        {/* Creates rows of saved artist with delete button*/}
                        {props.savedArtist.map(obj => {
                            return (
                                <tr>
                                    <td>{obj}</td>
                                    <td>
                                        <button onClick={() => remove(obj)} value={obj}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            }

        </div>
    )
}

export default Playlist
