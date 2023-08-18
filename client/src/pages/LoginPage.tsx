import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import { COLOURS } from '../theme/AppStyles';
import spotifyLogo from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { InAppModal } from '../components/InAppModal';
import '../styles/Background.css';

import { ReactComponent as CHERRIES } from '../Rifflandia/images/cherries.svg';

const LoginPage = memo(() => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isInAppBrowser = () => {
    // check if this react app is open within Instagram, LinkedIn, or Facebook's in-app browser
    if (navigator.userAgent.match(/FBAN|FBAV|Instagram|LinkedIn|Messenger/i)) {
      // in-app browser detected
      handleOpen();
      return true;
    }
    handleRedirectToAuth();
    return false;
  };

  const handleRedirectToAuth = () => {
    location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${BASE_REDIRECT_URI}&scope=${SCOPES.join(
      '%20',
    )}&response_type=token&show_dialog=true`;
  };

  useEffect(() => {
    document.title = 'Record Shop | Login';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="spacer layer"></div>
      <Container maxWidth="lg" sx={{ marginTop: '-24px' }}>
        <Typography
          variant="h3"
          sx={{ fontSize: '5rem', fontFamily: 'Lobster, Arial, sans-serif', letterSpacing: '2px' }}
        >
          Record Shop
        </Typography>
        <Typography sx={{ color: COLOURS.blue, fontWeight: '700', fontSize: '1.7rem', paddingTop: '8px' }}>
          Discover new music.
        </Typography>

        <Box
          sx={{
            width: '81%',
            maxWidth: '700px',
            '& .MuiTypography-body1': {
              fontSize: '1.25rem',
            },
          }}
        >
          <Typography sx={{ paddingTop: '12px' }}>
            Create personalized Spotify playlists with the top tracks from artists performing in your city or festival
            of choice.
          </Typography>

          <Typography sx={{ paddingTop: '12px' }}>To get started, sign in with Spotify.</Typography>
        </Box>

        <Box display="flex" flexDirection="column">
          <Button
            onClick={isInAppBrowser}
            // href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${BASE_REDIRECT_URI}&scope=${SCOPES.join(
            //   '%20',
            // )}&response_type=token&show_dialog=true`}
            variant="contained"
            //color="secondary"
            sx={{
              backgroundColor: COLOURS.blue,
              ':hover': {
                backgroundColor: COLOURS.card_colours[0],
              },
              color: 'black',
              width: '300px',
              marginTop: '24px',
              marginBottom: '16px',
              justifyContent: 'center',
              height: '48px',
            }}
          >
            <img
              src={spotifyLogo}
              alt="spotify_logo"
              width="20px"
              height="20px"
              style={{ marginRight: '8px', marginBottom: '3px' }}
            />
            Sign in with Spotify
          </Button>
        </Box>

        <Box
          sx={{
            width: '75%',
            maxWidth: '700px',
            '& .MuiTypography-body1': {
              fontSize: '1rem',
            },
            marginTop: '12px',
          }}
        >
          <Typography sx={{ paddingTop: '12px' }}>
            Or checkout the exclusive page that was created for Rifflandia:
          </Typography>
        </Box>

        <Button
          onClick={() => {
            navigate('/rifflandia');
          }}
          variant="outlined"
          sx={{ marginTop: '4px', marginBottom: '16px', padding: '8px 16px', width: '300px' }}
        >
          <Box sx={{ marginRight: '12px', height: '20px', width: '20px' }}>
            <CHERRIES />
          </Box>
          Rifflandia
        </Button>

        <Box
          sx={{
            width: '75%',
            maxWidth: '700px',
            '& .MuiTypography-body1': {
              fontSize: '1rem',
            },
            //marginTop: '16px',
          }}
        >
          <Typography sx={{ paddingTop: '12px' }}>Too tired to find you Spotify password?</Typography>
        </Box>

        <Button
          onClick={() => window.location.assign('https://open.spotify.com/user/31ma23i46a3p3vmxvvq7qmhk7w3q')}
          variant="outlined"
          sx={{ marginTop: '4px', marginBottom: '8px', padding: '8px 16px', width: '300px' }}
        >
          <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '16px' }} />
          Preview a Playlist
        </Button>
        <Box style={{ maxWidth: '700px', fontSize: '0.7rem', paddingBottom: '48px', marginTop: '4px' }}>
          (but its more fun to customize your own)
        </Box>

        <InAppModal open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
      </Container>
    </>
  );
});

LoginPage.displayName = 'LoginPage';

export default LoginPage;
