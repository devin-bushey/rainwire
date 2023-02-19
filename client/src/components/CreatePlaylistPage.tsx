import { useState, useEffect } from 'react';
import axios from 'axios';
import hash from '../utils/hash';
import styles from './styles/MainPage.module.css';
import { SpotifyUserDataType } from '../types/SpotifyTypes';
import { CreateNewPlaylist, GetSpotifyUserInfo } from '../apiManager/Spotify';
import { encrypt, getSpotifyTokenLocalStorage } from '../utils/tokenHandling';

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const CreatePlaylistPage = () => {
  const [spotifyInfo, setSpotifyInfo] = useState<SpotifyUserDataType>({
    firstName: '',
    user_name: '',
    user_id: '',
    new_playlist_id: '',
    access: false,
  });

  const [token, setToken] = useState('');

  // get token
  useEffect(() => {
    const localToken = getSpotifyTokenLocalStorage();
    let _token;

    // first, check for token in local storage
    // if not there, check for token in url, and if there, set it in local storage
    if (localToken) {
      _token = localToken;
      setToken(localToken);
    } else {
      _token = hash.access_token;
      if (_token) {
        encrypt(_token);
        setToken(_token);
      }
    }

    // if there is a token, get the user's info
    GetSpotifyUserInfo(_token).then((response) => {
      setSpotifyInfo((prevState) => ({
        ...prevState,
        firstName: response.firstName,
        user_name: response.user_name,
        user_id: response.user_id,
        access: response.access,
      }));
    });
  }, []);

  const HandleClickVictoria = () => {
    if (spotifyInfo.access) {
      if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
        CreateNewPlaylist({ city: 'victoria', token: token, user_id: spotifyInfo.user_id });
      }
    } else {
      alert('Whoops! Please send an email to devin.m.bushey@gmail.com to ask for access');
    }
  };

  return (
    <div className="container-sm" style={{ marginBottom: 50 }}>
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
          <br />
        </div>
        <br />

        <div className={styles.createContainer}>
          <p className={styles.create}>This will create a new playlist right on your account!</p>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
