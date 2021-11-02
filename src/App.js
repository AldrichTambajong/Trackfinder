import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Index from './components/Index'
import Login from './components/Login';
import Song from './components/Song'
import TrackfinderNav from './components/TrackfinderNav';
import Playlist from './components/Playlist';
import Signup from './components/Signup';

function App() {
  // Set all state variables to use respective sessionStorage variables so that
  // state variables will not lose any value given to them upon page reload.
  // Used sessionStorage and not localStorage so variables delete themselves
  // when user closes page
  const [loggedIn, setLogin] = useState(sessionStorage.getItem("loggedIn"))
  const [email, setEmail] = useState(sessionStorage.getItem("email"))
  const [name, setName] = useState(sessionStorage.getItem("name"))
  const [artistPresent, setArtistPresent] = useState(sessionStorage.getItem("artistPresent"))
  const [artistName, setArtistName] = useState(sessionStorage.getItem("artistName"))
  const [artistImg, setArtistImg] = useState(sessionStorage.getItem("artistImg"))
  const [songName, setSongName] = useState(sessionStorage.getItem("songName"))
  const [songUrl, setSongUrl] = useState(sessionStorage.getItem("songUrl"))
  const [songImg, setSongImg] = useState(sessionStorage.getItem("songImg"))
  const [albumName, setAlbumName] = useState(sessionStorage.getItem("albumName"))
  const [lyrics, setLyrics] = useState(sessionStorage.getItem("lyrics"))
  const [savedArtist, setSavedArtist] = useState([])
  const [signedUp, setSignedUp] = useState()

  useEffect(() => {
    // Loads playlist in playlist.js in /songInfo route; can't pass the 
    // savedArtist array to session storage since it turns it into 
    // a string and .map wouldn't work on it
    var user = {
      'email': email
    }
    fetch('/loadPlaylist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => {
        setSavedArtist(data.playlist)
      })
  })

  return (
    <div>
      {/* Router is the foundation for all Link,Switch, and Route tags */}
      <Router>
        <Route path="/">
          {/* Redirects to login page upon start up */}
          <Redirect to="/login"></Redirect>
        </Route>
        {/* Renders routes based on url path */}
        <Switch>
          {/* Routes act as conditionals, rendering components and redirecting to other paths 
          with respect to the correct url path */}
          <Route exact path="/login">
            {/* Shows login page if user hasn't been logged in (detected by loggedIn state variable) */}
            {loggedIn === "true" ?
              <Redirect to="/index"></Redirect>
              :
              <div>
                <Login setLogin={setLogin} setName={setName} setEmail={setEmail}>
                </Login>
                <div className="signUpLink">
                  <p>Don't have an account?</p>
                  {/* Redirects to signUp route if link is clicked (acts as an <a href=""> tag) */}
                  <Link to="/signUp">Sign Up</Link>
                </div>
              </div>
            }
          </Route>
          <Route exact path="/index">
            {/* Renders main searchbar page until user enters an artist to search */}
            {artistPresent === "true" ?
              <Redirect to="/songInfo"></Redirect>
              :
              <Index name={name} email={email} setArtistName={setArtistName} setArtistImg={setArtistImg} setSongName={setSongName}
                setSongUrl={setSongUrl} setSongImg={setSongImg} setAlbumName={setAlbumName} setLyrics={setLyrics}
                setArtistPresent={setArtistPresent} savedArtist={savedArtist} setSavedArtist={setSavedArtist}></Index>
            }
          </Route>
          <Route exact path="/songInfo" >
            <TrackfinderNav email={email} setArtistName={setArtistName} setArtistImg={setArtistImg} setSongName={setSongName}
              setSongUrl={setSongUrl} setSongImg={setSongImg} setAlbumName={setAlbumName} setLyrics={setLyrics}
              setArtistPresent={setArtistPresent} savedArtist={savedArtist} setSavedArtist={setSavedArtist} />

            <Song email={email} artistName={artistName} artistImg={artistImg} songName={songName}
              songUrl={songUrl} songImg={songImg} albumName={albumName} lyrics={lyrics} setSavedArtist={setSavedArtist}></Song>

            <Playlist email={email} savedArtist={savedArtist} setSavedArtist={setSavedArtist}></Playlist>
          </Route>
          <Route exact path="/signUp">
            {signedUp === true ?
              <Redirect to="/login"></Redirect>
              :
              <div>
                <Signup setSignedUp={setSignedUp}></Signup>
                <div className="loginLink">
                  <p>Already have an account?</p>
                  <Link to="/login">Login</Link>
                </div>
              </div>
            }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
