import { useState, useEffect } from 'react';
import hash from '../utils/hash';
import { SpotifyUserDataType } from '../types/SpotifyTypes';
import { CreateNewPlaylist, GetSpotifyUserInfo } from '../apiManager/Spotify';
import { encrypt, getSpotifyTokenLocalStorage } from '../utils/tokenHandling';
import { Card, Button, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Loading } from './Loading';
import { COLOURS } from '../theme/AppStyles';

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

  if (!token) return <Loading />;

  return (
    <Container>
      <Card
        sx={{
          backgroundColor: COLOURS.light_pink,
        }}
      >
        <Typography variant="h3" sx={{ color: COLOURS.pink }}>
          Hey {spotifyInfo.firstName}!
        </Typography>
      </Card>

      <Card
        sx={{
          backgroundColor: COLOURS.blue,
        }}
      >
        <Typography>Create a new playlist from shows playing in: </Typography>
        <Button onClick={HandleClickVictoria} variant="outlined">
          Victoria
        </Button>
      </Card>

      <Card
        sx={{
          backgroundColor: COLOURS.light_pink,
        }}
      >
        <Typography sx={{ color: COLOURS.pink }}>This will create a new playlist right on your account!</Typography>
      </Card>
    </Container>
  );
};

export default CreatePlaylistPage;
