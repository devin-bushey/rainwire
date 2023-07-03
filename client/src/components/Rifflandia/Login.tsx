import { useEffect, useState } from 'react';

import { Box, Button, Card, Container, Typography } from '@mui/material';
import { InAppModalRifflandia } from './InAppModalRifflandia';

import { BASE_REDIRECT_URI, AUTH_ENDPOINT, CLIENT_ID, SCOPES } from '../../constants/auth';
import { RIFFLANDIA_COLOURS } from './colours';

import TITLE from './images/title.svg';
import spotifyIcon from '../../spotifyLogos/Spotify_Icon_RGB_Black.png';
import './styles.css';
import { Email } from './Email';
import { sendEvent } from '../../hooks/ga4';

export const Login = () => {
  const redirectUri = BASE_REDIRECT_URI + 'rifflandia';

  useEffect(() => {
    document.title = 'Rifflandia Login';
    sendEvent('riff_login');
    window.scrollTo(0, 0);
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openEmail, setOpenEmail] = useState(false);
  const handleOpenEmail = () => setOpenEmail(true);

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
      <div className="sidebar-login sidebar-svg-park"></div>
      <div className="sidebar-login sidebar-svg-electric"></div>

      <Box
        className="riff-background"
        sx={{ textAlign: 'center', paddingBottom: '24px', backgroundColor: RIFFLANDIA_COLOURS.background }}
      >
        <Container
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: RIFFLANDIA_COLOURS.background,
              borderRadius: '10px',
              minWidth: '300px',
              maxWidth: '550px',
              margin: '8px',
            }}
          >
            <img style={{ width: '300px' }} src={TITLE} alt="Rifflandia Title" />

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
                  fontFamily: 'Lobster, cursive',
                  //fontWeight: '700',
                  letterSpacing: '2px',
                }}
              >
                Record Shop
              </Typography>
              <Typography sx={{ marginTop: '12px' }}>
                Effortlessly generate a playlist featuring the top tracks from each artist performing at Rifflandia.
              </Typography>

              <Typography sx={{ marginTop: '24px' }}>
                The playlist can be pre-populated and created right on your account!
              </Typography>

              <Typography sx={{ marginTop: '24px' }}>Start by signing in with Spotify</Typography>

              <Button
                onClick={isInAppBrowser}
                variant="contained"
                sx={{
                  backgroundColor: RIFFLANDIA_COLOURS.light_blue,
                  ':hover': {
                    backgroundColor: RIFFLANDIA_COLOURS.dark_blue,
                  },
                  color: 'black',
                  width: '100%',
                  marginTop: '24px',
                  marginBottom: '12px',
                  justifyContent: 'center',
                  height: '48px',
                }}
              >
                <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '16px' }} />
                <Typography sx={{ fontWeight: '700', paddingBottom: 0 }}>Sign in</Typography>
              </Button>
            </Card>
          </Box>
        </Container>

        <footer className="footer">
          <span style={{ fontSize: '1.1rem', fontFamily: 'Lobster, cursive', marginRight: '4px' }}>Record Shop </span>{' '}
          made by{' '}
          <button className="email-btn" onClick={handleOpenEmail}>
            Devin B
          </button>
          {/* <span><Typography onClick={handleOpenEmail}>Devin B</Typography></span> */}
          {/* <a href="https://www.linkedin.com/in/devin-bushey/">Devin Bushey</a> */}
        </footer>
      </Box>

      <Email openEmail={openEmail} setOpenEmail={setOpenEmail} />

      <InAppModalRifflandia open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </>
  );
};
