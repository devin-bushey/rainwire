import React, { useState, useEffect } from "react";
import axios from 'axios';
import hash from "./hash";
import styles from './styles/mainpage.module.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = process.env.REACT_APP_SP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_SITE_URL;
const scopes = [
  "playlist-modify-public"
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
            "public": true
          }
        })
        .then((response) => {

          setSpotifyInfo((prevState) => ({
            ...prevState,
            new_playlist_id: response.data.id,
          }));

          resolve(response.data);

          console.log('Successfully created a playist: ' + playlist_name);

        })
        .catch(function (error) {
          console.log("Error: CreateBlankPlaylist");
          console.log(error);
        }); //end axios
    }); //end promise

  }

  const CreateNewPlaylist = async (city) => {

    var playlist_data = await CreateBlankPlaylist(city);

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

        AddTracksToPlaylist(playlist_data.id, playlist_data.external_urls.spotify, tracks);

      })
      .catch(function (error) {
        console.log("Error CreateNewPlaylist")
        console.log(error);
      });
  }

  const AddTracksToPlaylist = (playlist_id, playlist_url, tracks) => {

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
        window.alert("Successfully created a new playlist!");

        window.location.assign(playlist_url);
      })
      .catch(function (error) {
        console.log("Error: unsuccessfully added tracks to playlist");
        console.log(error);
      });
  }


  const HandleClickVictoria = () => {

    if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      CreateNewPlaylist("victoria");
    }
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
    <div className="container-sm" style={{ marginBottom: 50 }}>

      {!token && (

        <div className="container-sm">
          <h3>What's Record Shop?</h3>
          <br />
          <div className={styles.welcomeContainer}>
            <p>Record Shop helps you </p>
            <p><span className={styles.color1}>find new music.</span></p>
            <br />
            <p>Pick a city from the tabs above and check out the upcoming concert listings.</p>
            <br />
            <p><span className={styles.color1}>Create a new playlist</span> on your spotify account with the top track from each artist playing in your chosen city.</p>
            <br />
            <p>Let's start by logging into <span className={styles.color3}>Spotify.</span></p>
            <br />
            <button className={styles.login}>
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=token&show_dialog=true`}
              >
                Login to Spotify
              </a>
            </button>
            <br/>
            <br/>
            <p style={{ fontSize: 15, fontStyle: "italic" }}>by Devin Bushey</p>
          </div>
        </div>
      )}
      {access && token && (

        <div className="container-sm">
          <h3>Hey {spotifyInfo.user_name}!</h3>
          <br />
          <div className={styles.heyContainer}>
            <p><span className={styles.color1}>Create a new playlist</span> from shows playing in: </p>
            <br/>
            <button className={styles.cities} onClick={HandleClickVictoria}>
              Victoria
            </button>
            <button className={styles.cities} onClick={HandleClickVancouver}>
              Vancouver
            </button>
            <button className={styles.cities} onClick={HandleClickOttawa}>
              Ottawa
            </button>
            <br/>
            <br/>
            <p>This will create a new playlist right on your account!</p>
            <br/>
            <p>Look for <span style={{textDecorationLine: "underline"}}>Record Shop - city</span> on your Spotify.</p>
          </div>
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
