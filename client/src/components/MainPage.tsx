import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import { COLOURS } from '../theme/AppStyles';
import spotifyLogo from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { InAppModal } from './InAppModal';

const MainPage = memo(() => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isInAppBrowser = () => {
    console.log(navigator.userAgent);
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '32px' }}>
      <Typography variant="h3" sx={{ fontSize: '4rem' }}>
        What&apos;s Record Shop?
      </Typography>
      <Typography sx={{ color: COLOURS.blue, fontWeight: '700', fontSize: '2rem' }}>
        Record Shop helps you find new music.
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
          Create personalized playlists with the top tracks from artists performing in your city or festival of choice.
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column">
        <Button
          onClick={isInAppBrowser}
          // href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${BASE_REDIRECT_URI}&scope=${SCOPES.join(
          //   '%20',
          // )}&response_type=token&show_dialog=true`}
          variant="contained"
          color="secondary"
          sx={{ marginTop: '24px', marginBottom: '24px', padding: '8px 16px', maxWidth: '222px' }}
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

        <Button
          onClick={() => {
            navigate('/about');
          }}
          variant="outlined"
          sx={{ marginBottom: '24px', padding: '8px 16px', maxWidth: '222px' }}
        >
          About
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
        <Typography sx={{ paddingTop: '12px' }}>To get started, sign in with Spotify.</Typography>
      </Box>

      <InAppModal open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </Container>
  );
});

MainPage.displayName = 'MainPage';

export default MainPage;
