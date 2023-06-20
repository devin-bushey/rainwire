import { Card, Typography, Slider, Button } from '@mui/material';
import { Container, Box } from '@mui/system';
import { COLOURS } from '../theme/AppStyles';
import { Filter } from './Filter';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';

export const Settings = (props: any) => {
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
          <Typography variant="h6" sx={{ color: COLOURS.black }}>
            tracks per artist:
          </Typography>
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

        {/* <Filter
          totalTickets={props.totalTickets}
          filteredGenres={props.filteredGenres}
          handleFilteredGenres={props.handleFilteredGenres}
          handleDeleteGenre={props.handleDeleteGenre}
          handleClearGenres={props.handleClearGenres}
        /> */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '-8px',
            marginBottom: '-8px',
          }}
        >
          <Button variant="outlined" sx={{ color: COLOURS.black }} onClick={props.handleCloseSettings}>
            Close
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
