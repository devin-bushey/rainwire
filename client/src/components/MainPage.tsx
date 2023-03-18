import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { send } from 'emailjs-com';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLOURS } from '../theme/AppStyles';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = import.meta.env.VITE_SP_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SITE_URL + 'create';
const scopes = ['playlist-modify-public'];

const MainPage = memo(() => {
  const navigate = useNavigate();

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
          width: '75%',
          maxWidth: '700px',
          '& .MuiTypography-body1': {
            fontSize: '1.25rem',
          },
        }}
      >
        <Typography sx={{ paddingTop: '16px' }}>
          Pick a city from the tabs above and check out the upcoming concert listings.
        </Typography>

        <Typography sx={{ padding: '16px 0' }}>
          <Typography display="inline" sx={{ fontWeight: '700' }}>
            Create a new playlist
          </Typography>{' '}
          on your spotify account with the top track from each artist playing in your chosen city.
        </Typography>

        <Typography>Let&apos;s start by checking out the list of shows playing in Victoria.</Typography>
        <Button
          onClick={() => {
            navigate('/vic');
          }}
          variant="contained"
          sx={{ backgroundColor: COLOURS.accent_03, marginTop: '8px', marginBottom: '16px' }}
        >
          Victoria
        </Button>

        <Typography>
          Sign up to create your own playlist on your Spotify account. Or if you&apos;re already registered then log in.
        </Typography>
        <Button
          onClick={() => {
            navigate('/signup');
          }}
          variant="contained"
          sx={{ backgroundColor: COLOURS.accent_03, marginTop: '8px', marginRight: '8px' }}
        >
          Sign Up
        </Button>
        <Button
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            '%20',
          )}&response_type=token&show_dialog=true`}
          variant="contained"
          sx={{ backgroundColor: COLOURS.accent_03, marginTop: '8px' }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
});

MainPage.displayName = 'MainPage';

export default MainPage;
