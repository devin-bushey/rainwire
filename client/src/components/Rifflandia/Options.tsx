import { Card, Typography, Slider, Button, Link } from '@mui/material';
import { Box } from '@mui/system';
import { COLOURS } from '../../theme/AppStyles';
import spotifyIcon from '../../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { useNavigate } from 'react-router-dom';

export const Options = (props: any) => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate('/rifflandia');
    window.location.reload();
  };

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        //marginLeft: 'auto',
        //marginRight: 'auto',
        //marginBottom: '24px',
      }}
    >
      <Card
        sx={{
          backgroundColor: props.colour ? props.colour : 'hsl(141, 12%, 80%)',
          minHeight: '290px',
          width: '300px',
          margin: '8px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '4px' }}>
          <Typography variant="h5" sx={{ color: COLOURS.black }}>
            <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
            Options
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Typography>Top tracks to add per artist:</Typography>
          <Box sx={{ width: '90%' }}>
            <Slider
              aria-label="Number of tracks per artist"
              valueLabelDisplay="auto"
              step={1}
              marks={marks}
              min={1}
              max={5}
              value={props.numTopTracks}
              onChange={props.handleNumTopTracks}
            />
          </Box>
        </Box>
        {/* 
        <Box sx={{ marginTop: '12px' }}>
          <Button variant="outlined" onClick={logOut}>
            Sign Out
          </Button>
        </Box> */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '8px',
            //marginBottom: '8px',
          }}
        >
          <Button sx={{ width: '120px' }} variant="outlined" onClick={logOut}>
            Sign Out
          </Button>
          <Button variant="outlined" sx={{ marginLeft: '8px', width: '120px' }} onClick={props.handleCloseSettings}>
            Close
          </Button>
        </Box>

        <Box sx={{ marginTop: '24px' }}>
          <Link href="https://www.spotify.com/account/apps">
            <Typography sx={{ fontSize: '12px' }}>Unsubscribe</Typography>
          </Link>
        </Box>
      </Card>
    </Box>
  );
};
