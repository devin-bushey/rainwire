import React, { useState, useEffect } from "react";
import axios from 'axios';
import hash from "./hash";
import styles from './styles/mainpage.module.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = process.env.REACT_APP_SP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_SITE_URL;
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-modify-public",
  "playlist-modify-private"
];

function MainPage() {

  const [spotifyInfo, setSpotifyInfo] = useState({

    user_name: "",
    user_id: "",
    new_playlist_id: "",

  });

  const [token, setToken] = useState(null);
  const [access, setAccess] = useState(false);

  // get token
  useEffect(() => {

    let _token = hash.access_token;
    if (_token) {
      setToken(_token);
    }

  }, []);

  // set Access
  // users must be registered through spotify developer
  useEffect(() => {

    if (token) {
      GetSpotifyUserInfo(token)
    }

  }, [token]);

  const GetSpotifyUserInfo = (token) => {

    axios
      ({
        url: 'https://api.spotify.com/v1/me/',
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + token,
        }
      })
      .then((response) => {

        if (!response.data) {
          return;
        }

        var firstName = response.data.display_name.substring(0, response.data.display_name.indexOf(' ')).trim();

        setSpotifyInfo((prevState) => ({
          ...prevState,
          user_name: firstName,
          user_id: response.data.id,
        }));

        setAccess(true);

      })
      .catch(function (error) {
        setAccess(false);
        console.log("Error GetSpotifyUserInfo");
        console.log(error);
      });
  }

  const CreateBlankPlaylist = async (city) => {

    var playlist_name = "Record Shop - " + city;

    return new Promise(async function (resolve, reject) {
      axios
        ({
          url: 'https://api.spotify.com/v1/users/' + spotifyInfo.user_id + '/playlists',
          method: 'POST',
          headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json',
          },
          data: {
            "name": playlist_name,
            "description": "a mixtape of upcoming concerts --> created by recordshopp.netlify.app",
            "public": false
          }
        })
        .then((response) => {

          setSpotifyInfo((prevState) => ({
            ...prevState,
            new_playlist_id: response.data.id,
          }));

          resolve(response.data.id);

          console.log('Successfully created a playist: ' + playlist_name);

        })
        .catch(function (error) {
          console.log("Error: CreateBlankPlaylist");
          console.log(error);
        }); //end axios
    }); //end promise

  }

  const CreateNewPlaylist = async (city) => {

    var playlist_id = await CreateBlankPlaylist(city);

    axios
      .get(process.env.REACT_APP_SITE_URL_DB + city + "/")
      .then((response) => {
        var data = response.data
        var tracks = "";
        var numTopTracksToAdd = 1;

        for (const element of data) {

          try {

            for (let i = 0; i < numTopTracksToAdd; i++) {
              tracks += element.top_tracks[i].uri;
              tracks += ",";
            }

          }
          catch { }

        }

        tracks = tracks.substring(0, tracks.length - 1); // remove last comma

        AddTracksToPlaylist(playlist_id, tracks);

      })
      .catch(function (error) {
        console.log("Error CreateNewPlaylist")
        console.log(error);
      });
  }

  const AddTracksToPlaylist = (playlist_id, tracks) => {

    axios({
      url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=" + tracks,
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {

        console.log("Successfully added tracks to playlist");

      })
      .catch(function (error) {
        console.log("Error: unsuccessfully added tracks to playlist");
        console.log(error);
      });
  }


  const HandleClickVancouver = () => {

    if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      CreateNewPlaylist("vancouver");
    }
  }

  const HandleClickOttawa = () => {
    if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      CreateNewPlaylist("ottawa");
    }
  }

  return (
    <div className="styles.body">

      {!token && (

        <div className="container-sm">
          <h3>Welcome</h3>
          <br />
          <p>Record Shop helps you find new music.</p>
          <br />
          <p>Pick a city from the tabs above and check out the upcoming concert listings.</p>
          <p>Record Shop creates a new playlist on your spotify account with the top track from each artist playing in your chosen city</p>
          <br />
          <p>Let's start by logging into Spotify.</p>
          <br />
          <button>
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          </button>
        </div>
      )}
      {access && token && (

        <div className="container-sm">
          <p>Hey {spotifyInfo.user_name}!</p>
          <p>Create a new playlist from shows playing in: </p>
          <button style={{ margin: 10 }} onClick={HandleClickVancouver}>
            Vancouver
          </button>
          <button style={{ margin: 10 }} onClick={HandleClickOttawa}>
            Ottawa
          </button>
        </div>
      )}
      {!access && token && (
        <div>
          <p>Whoops! Please send an email to devin.m.bushey@gmail.com to ask for access</p>
          <p>Please include your name and email associated with your spotify account</p>
        </div>
      )}

    </div>
  );


}

export default MainPage;
