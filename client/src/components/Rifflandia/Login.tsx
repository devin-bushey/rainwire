import { Box, Button, Card, Container, Typography } from '@mui/material';
import { RIFFLANDIA_COLOURS } from './colours';
import { InAppModalRifflandia } from './InAppModalRifflandia';
import TITLE from './title.svg';
import spotifyIcon from '../../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { useState } from 'react';
import { BASE_REDIRECT_URI, AUTH_ENDPOINT, CLIENT_ID, SCOPES } from '../../constants/auth';

export const Login = () => {
  const redirectUri = BASE_REDIRECT_URI + 'rifflandia';

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
    location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SCOPES.join(
      '%20',
    )}&response_type=token&show_dialog=true`;
  };

  return (
    <>
      <div className="sidebar sidebar-svg-park"></div>
      <div className="sidebar sidebar-svg-electric"></div>

      <Box
        className="riff-background"
        sx={{ textAlign: 'center', paddingBottom: '24px', backgroundColor: RIFFLANDIA_COLOURS.background }}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          <Box
            sx={{
              backgroundColor: RIFFLANDIA_COLOURS.background,
              borderRadius: '10px',
              width: '300px',
              margin: '8px',
            }}
          >
            <img src={TITLE} alt="Rifflandia Title" />

            <Card
              sx={{
                backgroundColor: RIFFLANDIA_COLOURS.fill_pale_purple,
                marginTop: '24px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '2.3rem',
                  //fontFamily: 'Lobster, cursive',
                  fontFamily: 'Caveat, cursive',
                  fontWeight: '700',
                }}
              >
                Record Shop
              </Typography>
              <Typography sx={{ marginTop: '12px' }}>
                Effortlessly generate a playlist featuring the top tracks from each artist performing at Rifflandia.
              </Typography>

              <Typography sx={{ marginTop: '12px' }}>Start by signing in with Spotify</Typography>

              <Button
                onClick={isInAppBrowser}
                variant="contained"
                className="create-playlist"
                sx={{
                  backgroundColor: RIFFLANDIA_COLOURS.light_blue,
                  ':hover': {
                    backgroundColor: RIFFLANDIA_COLOURS.dark_blue,
                  },
                  color: 'black',
                  width: '100%',
                  marginTop: '24px',
                  marginBottom: '24px',
                  justifyContent: 'center',
                  height: '48px',
                }}
              >
                <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '16px' }} />
                <Typography sx={{ fontWeight: '700', paddingBottom: 0 }}>Sign in</Typography>
              </Button>
            </Card>

            {/* <Typography sx={{ marginTop: '12px' }}>
              Once signed in, the playlist can be generated and pre-filled for you directly on your account, with a
              single click of a button.
            </Typography> */}
          </Box>
        </Container>
      </Box>

      <InAppModalRifflandia open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </>
  );
};
