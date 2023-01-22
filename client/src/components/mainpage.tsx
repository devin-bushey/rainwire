import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hash from './hash';
import styles from './styles/mainpage.module.css';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = import.meta.env.VITE_SP_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SITE_URL;
const scopes = ['playlist-modify-public'];

function MainPage() {
  const [spotifyInfo, setSpotifyInfo] = useState({
    user_name: '',
    user_id: '',
    new_playlist_id: '',
  });

  const [token, setToken] = useState(null);
  const [access, setAccess] = useState(false);

  // get token
  useEffect(() => {
    const _token = hash.access_token;
    if (_token) {
      setToken(_token);
    }
  }, []);

  // set Access
  // users must be registered through spotify developer
  useEffect(() => {
    if (token) {
      GetSpotifyUserInfo(token);
    }
  }, [token]);

  const GetSpotifyUserInfo = (token: string) => {
    axios({
      url: 'https://api.spotify.com/v1/me/',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (!response.data) {
          return;
        }

        const firstName = response.data.display_name.substring(0, response.data.display_name.indexOf(' ')).trim();

        setSpotifyInfo((prevState) => ({
          ...prevState,
          user_name: firstName,
          user_id: response.data.id,
        }));

        setAccess(true);
      })
      .catch(function (error) {
        setAccess(false);
        console.log('Error GetSpotifyUserInfo');
        console.log(error);
      });
  };

  const CreateBlankPlaylist = async (city: string) => {
    const playlist_name = 'Record Shop - ' + city;

    return new Promise((resolve) => {
      axios({
        url: 'https://api.spotify.com/v1/users/' + spotifyInfo.user_id + '/playlists',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        data: {
          name: playlist_name,
          description: 'a mixtape of upcoming concerts --> created by recordshopp.netlify.app',
          public: true,
        },
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
          console.log('Error: CreateBlankPlaylist');
          console.log(error);
        }); //end axios
    }); //end promise
  };

  const CreateNewPlaylist = async (city: string) => {
    const playlist_data: any = await CreateBlankPlaylist(city);

    axios
      .get(import.meta.env.VITE_SITE_URL_DB + city + '/')
      .then((response) => {
        const data = response.data;
        let tracks = '';
        const numTopTracksToAdd = 1;

        for (const element of data) {
          try {
            for (let i = 0; i < numTopTracksToAdd; i++) {
              tracks += element.top_tracks[i].uri;
              tracks += ',';
            }
          } catch (error) {
            console.log(error);
          }
        }

        tracks = tracks.substring(0, tracks.length - 1); // remove last comma

        AddTracksToPlaylist(playlist_data.id, playlist_data.external_urls.spotify, tracks);
      })
      .catch(function (error) {
        console.log('Error CreateNewPlaylist');
        console.log(error);
      });
  };

  const AddTracksToPlaylist = (playlist_id: string, playlist_url: string | URL, tracks: string) => {
    axios({
      url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?uris=' + tracks,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        console.log('Successfully added tracks to playlist');
        window.alert('Successfully created a new playlist!');

        window.location.assign(playlist_url);
      })
      .catch(function (error) {
        console.log('Error: unsuccessfully added tracks to playlist');
        console.log(error);
      });
  };

  const HandleClickVictoria = () => {
    if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      CreateNewPlaylist('victoria');
    }
  };

  const HandleClickVancouver = () => {
    if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      CreateNewPlaylist('vancouver');
    }
  };

  const HandleClickOttawa = () => {
    if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      CreateNewPlaylist('ottawa');
    }
  };

  return (
    <div className="container-sm" style={{ marginBottom: 50 }}>
      {!token && (
        <div className="container-sm">
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>What&apos;s Record Shop?</h3>
            <br />
            <p className={styles.subtitle}>Record Shop helps you find new music.</p>
            <br />
            <p className={styles.subtitle}>
              Pick a city from the tabs above and check out the upcoming concert listings.
            </p>
          </div>
          <br />

          <div className={styles.createContainer}>
            <p className={styles.create}>
              Create a new playlist on your spotify account with the top track from each artist playing in your chosen
              city.
            </p>
          </div>
          <br />

          <div className={styles.welcomeContainer}>
            <p className={styles.loginMessage}>Let&apos;s start by logging into Spotify.</p>

            <button className={styles.login}>
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  '%20',
                )}&response_type=token&show_dialog=true`}
              >
                <p className={styles.buttonText}>Login to Spotify</p>
              </a>
            </button>
          </div>
        </div>
      )}
      {access && token && (
        <div className="container-sm">
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>Hey {spotifyInfo.user_name}!</h3>
          </div>
          <br />

          <div className={styles.welcomeContainer}>
            <p className={styles.cityMessage}>Create a new playlist from shows playing in: </p>

            <button className={styles.cities} onClick={HandleClickVictoria}>
              <div className={styles.flex_container}>
                <div>Victoria</div>
                <div></div>
                <div>&gt;</div>
              </div>
            </button>
            <br />
            <button className={styles.cities} onClick={HandleClickVancouver}>
              <div className={styles.flex_container}>
                <div>Vancouver</div>
                <div></div>
                <div>&gt;</div>
              </div>
            </button>
            <br />
            <button className={styles.cities} onClick={HandleClickOttawa}>
              <div className={styles.flex_container}>
                <div>Ottawa</div>
                <div></div>
                <div>&gt;</div>
              </div>
            </button>
            <br />
            <br />
          </div>
          <br />

          <div className={styles.createContainer}>
            <p className={styles.create}>This will create a new playlist right on your account!</p>
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
