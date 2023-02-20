import { useState, useEffect } from 'react';
import hash from '../utils/hash';
import { SpotifyUserDataType } from '../types/SpotifyTypes';
import { CreateNewPlaylist, GetSpotifyUserInfo } from '../apiManager/Spotify';
import { encrypt, getSpotifyTokenLocalStorage } from '../utils/tokenHandling';
import { Card, Button, Container, Box, Modal } from '@mui/material';
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      if (response.error) {
        localStorage.clear();
      }

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
      handleOpen();
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: COLOURS.black }}>
            Whoops!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, color: COLOURS.black }}>
            Spotify limits the amount of users that I can allow to create playlists. Please send an email to
            devin.m.bushey@gmail.com to ask for access.
          </Typography>
          <Typography id="modal-modal-description2" sx={{ mt: 2, color: COLOURS.black }}>
            In the meantime, preview an already made playlist:
          </Typography>
          <Button variant="contained" href="https://open.spotify.com/playlist/5WLXLKF5xkuBZkCpyidpzW" target="_blank">
            Preview
          </Button>
        </Box>
      </Modal>

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
