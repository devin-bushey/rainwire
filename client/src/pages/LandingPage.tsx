import { useEffect } from 'react';
import { Button, Container, Box, Card } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Loading } from './Loading';
import { COLOURS } from '../theme/AppStyles';
import { useNavigate } from 'react-router-dom';
import useSpotifyAuth from '../hooks/useSpotifyAuth';

export const LandingPage = () => {
  const { spotifyInfo } = useSpotifyAuth();

  if (!spotifyInfo) return <Loading />;

  useEffect(() => {
    document.title = 'Record Shop | Welcome';
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '32px' }}>
      <Typography variant="h3" sx={{ color: COLOURS.accent_02 }}>
        Hey {spotifyInfo.firstName}!
      </Typography>

      <Box
        sx={{
          width: { sm: '90%', md: '75%' },
          maxWidth: '700px',
          '& .MuiTypography-body1': {
            fontSize: '1.25rem',
          },
        }}
      >
        <Card
          sx={{
            marginTop: '16px',
            backgroundColor: COLOURS.card_colours[1],
          }}
        >
          <Typography sx={{ padding: '16px 0' }}>
            1. Check out the upcoming concerts by clicking the button below.
          </Typography>

          <Button
            onClick={() => navigate('/artists')}
            variant="contained"
            color="secondary"
            sx={{ marginTop: '8px', marginBottom: '8px', width: '225px' }}
          >
            Artists
          </Button>
        </Card>

        <Card
          sx={{
            marginTop: '16px',
            backgroundColor: COLOURS.card_colours[0],
          }}
        >
          <Typography sx={{ padding: '16px 0' }}>
            2. Select the number of top tracks that you want to add to your playlist.
          </Typography>
        </Card>

        <Card
          sx={{
            marginTop: '16px',
            backgroundColor: COLOURS.card_colours[2],
          }}
        >
          <Typography sx={{ padding: '16px 0' }}>
            3. Finally, create a personalized playlist directly on your Spotify account!
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};
