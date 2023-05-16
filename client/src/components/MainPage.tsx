import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { memo, useEffect } from 'react';
import { COLOURS } from '../theme/AppStyles';
import spotifyLogo from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { useNavigate } from 'react-router-dom';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = import.meta.env.VITE_SP_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SITE_URL + 'create';
const scopes = ['playlist-modify-public'];

const MainPage = memo(() => {
  const navigate = useNavigate();

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
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            '%20',
          )}&response_type=token&show_dialog=true`}
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
          //color="secondary"
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
    </Container>
  );
});

MainPage.displayName = 'MainPage';

export default MainPage;

// import { Box, Container } from '@mui/material';
// import Button from '@mui/material/Button/Button';
// import Typography from '@mui/material/Typography';
// import { send } from 'emailjs-com';
// import { memo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { COLOURS } from '../theme/AppStyles';
// import spotifyLogo from '../spotifyLogos/Spotify_Icon_RGB_Black.png';

// export const authEndpoint = 'https://accounts.spotify.com/authorize';
// const clientId = import.meta.env.VITE_SP_CLIENT_ID;
// const redirectUri = import.meta.env.VITE_SITE_URL + 'create';
// const scopes = ['playlist-modify-public'];

// const MainPage = memo(() => {
//   return (
//     <Container maxWidth="lg" sx={{ marginBottom: '32px' }}>
//       <Typography variant="h3" sx={{ fontSize: '4rem' }}>
//         What&apos;s Record Shop?
//       </Typography>
//       <Typography sx={{ color: COLOURS.blue, fontWeight: '700', fontSize: '2rem' }}>
//         Record Shop helps you find new music.
//       </Typography>

//       <Button
//         href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
//           '%20',
//         )}&response_type=token&show_dialog=true`}
//         variant="contained"
//         color="secondary"
//         sx={{ marginTop: '24px', marginBottom: '24px', padding: '8px 16px' }}
//       >
//         <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
//         Login with Spotify
//       </Button>

//       <Box
//         sx={{
//           width: '75%',
//           maxWidth: '700px',
//           '& .MuiTypography-body1': {
//             fontSize: '1.25rem',
//           },
//         }}
//       >
//         <Typography sx={{ paddingTop: '12px' }}>
//           Check out the upcoming concert listings by clicking &apos;Artists&apos; in the tab above.
//         </Typography>

//         <Typography sx={{ paddingTop: '12px', paddingBottom: '24px' }}>
//           Then log in to create your own playlist on your Spotify account.
//         </Typography>
//       </Box>
//     </Container>
//   );
// });

// MainPage.displayName = 'MainPage';

// export default MainPage;
