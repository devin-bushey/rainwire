import { useState, useEffect, useContext } from 'react';
import hash from '../utils/hash';
import { SpotifyUserDataType } from '../types/SpotifyTypes';
import { CreateNewPlaylist, GetSpotifyUserInfo } from '../apiManager/Spotify';
import { encrypt, getSpotifyTokenLocalStorage } from '../utils/tokenHandling';
import { Button, Container, Box, Modal, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Loading } from './Loading';
import { COLOURS } from '../theme/AppStyles';
import { SPOTIFY_PREVIEW_PLAYLIST_URL } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import spotifyLogo from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { Cities, Festivals } from '../constants/enums';
import { SnackBarContext } from '../App';

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const CreatePlaylistPage = () => {
  const [spotifyInfo, setSpotifyInfo] = useState<SpotifyUserDataType>({
    firstName: '',
    user_name: '',
    user_id: '',
    new_playlist_id: '',
    access: false,
  });

  const navigate = useNavigate();

  const [token, setToken] = useState('');

  const [open, setOpen] = useState(false);

  //const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

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

  useEffect(() => {
    if (isError) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: 'Error creating playlist. Please try again.',
        isError: true,
      });
      setIsError(false);
    }
  }, [isError]);

  const HandleClickCreate = () => {
    if (spotifyInfo.access) {
      //setCity('vancouver');
      handleConfirmOpen();
      // if (window.confirm('Are you sure you want to create a new playlist on your account?')) {
      //   CreateNewPlaylist({ city: 'victoria', token: token, user_id: spotifyInfo.user_id });
      // }
    } else {
      //handleOpen();
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: 'Whoops! Please try to sign in again',
        isError: true,
      });
      setIsError(false);
    }
  };

  if (!token) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '32px' }}>
      <Typography variant="h3" sx={{ color: COLOURS.accent_02 }}>
        Hey {spotifyInfo.firstName}!
      </Typography>

      <Box
        sx={{
          width: '75%',
          maxWidth: '700px',
          '& .MuiTypography-body1': {
            fontSize: '1.25rem',
          },
        }}
      >
        <Typography sx={{ padding: '16px 0' }}>Preview the artists playing in:</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '175px' }}>
        <Button
          onClick={() => {
            navigate('/philips');
          }}
          variant="outlined"
          //color="secondary"
          sx={{ marginTop: '8px', marginBottom: '16px' }}
        >
          Philips Backyard
        </Button>

        <Button
          onClick={() => {
            navigate('/whistle');
          }}
          variant="outlined"
          //color="secondary"
          sx={{ marginTop: '8px', marginBottom: '16px' }}
        >
          Whistlemania
        </Button>

        <Button
          onClick={() => {
            navigate('/vic');
          }}
          variant="outlined"
          //color="secondary"
          sx={{ marginTop: '8px', marginBottom: '16px' }}
        >
          Victoria
        </Button>
        <Button
          onClick={() => {
            navigate('/van');
          }}
          variant="outlined"
          //color="secondary"
          sx={{ marginTop: '8px', marginBottom: '16px' }}
        >
          Vancouver
        </Button>
      </Box>

      <Box
        sx={{
          width: '75%',
          maxWidth: '700px',
          '& .MuiTypography-body1': {
            fontSize: '1.25rem',
          },
        }}
      >
        <Typography sx={{ padding: '16px 0' }}>
          Create a new playlist on your Spotify account with the top track from each artist playing in your chosen
          location.
        </Typography>
      </Box>

      <Box sx={{ padding: '12px 0' }}>
        <Button onClick={HandleClickCreate} variant="contained" color="secondary">
          <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
          Create a new playlist
        </Button>
      </Box>

      <Box sx={{ marginTop: '32px' }}>
        <Link href="https://www.spotify.com/account/apps">Unsubscribe</Link>
      </Box>

      <Modal
        open={confirmOpen}
        onClose={handleConfirmClose}
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Create a playlist for:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '225px' }}>
            <Button
              onClick={() => {
                CreateNewPlaylist({
                  city: Festivals.PhilipsBackyard,
                  token: token,
                  user_id: spotifyInfo.user_id,
                  setIsError: setIsError,
                });
                handleConfirmClose();
              }}
              variant="contained"
              color="secondary"
              sx={{ margin: '8px 0', justifyContent: 'left' }}
            >
              <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0, width: '100%' }}>Philips Backyard</Typography>
            </Button>

            <Button
              onClick={() => {
                CreateNewPlaylist({
                  city: Festivals.Whistlemania,
                  token: token,
                  user_id: spotifyInfo.user_id,
                  setIsError: setIsError,
                  numTopTracks: 5,
                });
                handleConfirmClose();
              }}
              variant="contained"
              color="secondary"
              sx={{ margin: '8px 0', justifyContent: 'left' }}
            >
              <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0, width: '100%' }}>Whistlemania</Typography>
            </Button>

            <Button
              onClick={() => {
                CreateNewPlaylist({
                  city: Cities.Victoria,
                  token: token,
                  user_id: spotifyInfo.user_id,
                  setIsError: setIsError,
                });

                handleConfirmClose();
              }}
              variant="contained"
              color="secondary"
              sx={{ margin: '8px 0', justifyContent: 'left' }}
            >
              <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0, width: '100%' }}>Victoria</Typography>
            </Button>
            <Button
              onClick={() => {
                CreateNewPlaylist({
                  city: Cities.Vancouver,
                  token: token,
                  user_id: spotifyInfo.user_id,
                  setIsError: setIsError,
                });
                handleConfirmClose();
              }}
              variant="contained"
              color="secondary"
              sx={{ margin: '8px 0', justifyContent: 'left' }}
            >
              <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0, width: '100%' }}>Vancouver</Typography>
            </Button>
          </Box>
        </Box>
      </Modal>

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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Whoops!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Spotify limits the amount of users that I can allow to create playlists. Please sign up to ask for access.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/signup');
            }}
          >
            Sign Up
          </Button>
          <Typography id="modal-modal-description2" sx={{ mt: 2 }}>
            In the meantime, preview an already made playlist:
          </Typography>
          <Button variant="contained" href={SPOTIFY_PREVIEW_PLAYLIST_URL} target="_blank">
            Preview
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default CreatePlaylistPage;
