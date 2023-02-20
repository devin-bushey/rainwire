import { Card, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { COLOURS } from '../theme/AppStyles';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = import.meta.env.VITE_SP_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SITE_URL + 'create';
const scopes = ['playlist-modify-public'];

const MainPage = memo(() => {
  return (
    <Container maxWidth="lg">
      <Card sx={{ backgroundColor: COLOURS.light_pink }}>
        <Typography variant="h3" sx={{ color: COLOURS.pink }}>
          What&apos;s Record Shop?
        </Typography>
        <Typography sx={{ color: COLOURS.blue }}>Record Shop helps you find new music.</Typography>
        <Typography sx={{ color: COLOURS.blue }}>
          Pick a city from the tabs above and check out the upcoming concert listings.
        </Typography>
      </Card>
      <Card>
        <Typography sx={{ color: COLOURS.pink }}>
          Create a new playlist on your spotify account with the top track from each artist playing in your chosen city.
        </Typography>
      </Card>

      <Card sx={{ backgroundColor: COLOURS.blue }}>
        <Typography>Let&apos;s start by logging into Spotify.</Typography>
        <Button
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            '%20',
          )}&response_type=token&show_dialog=true`}
          variant="contained"
          sx={{ color: COLOURS.black, backgroundColor: COLOURS.gold, marginTop: '8px' }}
        >
          Login to Spotify
        </Button>
      </Card>
    </Container>
  );
});

MainPage.displayName = 'MainPage';

export default MainPage;
