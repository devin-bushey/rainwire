import { Card, Typography, CardMedia, Button } from '@mui/material';
import { Box } from '@mui/system';
import spotifyLogoBlack from '../spotifyLogos/Spotify_Logo_RGB_Black.png';

export const Ticket = (props: any) => (
  <Card
    sx={{
      backgroundColor: props.bgcolor,
      height: props.showGenres ? '330px' : '300px',
      width: '300px',
      margin: '8px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'left' }}>
      <img
        src={spotifyLogoBlack}
        alt="spotify_logo"
        width="75px"
        height="22.48px"
        style={{ marginBottom: '14px' }}
        loading="lazy"
      />
    </Box>

    <Box sx={{ height: '60px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '1.25rem',
        }}
      >
        {props.ticket.sp_band_name}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Vertically center the items
        //margin: '8px',
        //width: '100px',
      }}
    >
      <CardMedia
        component="img"
        sx={{ display: 'inline-block', width: 120, height: 120 }}
        image={props.image}
        alt="Album"
      />
      <Box
        sx={{
          display: 'inline-block',
          margin: '8px',
          width: '102px',
        }}
      >
        <Typography
          sx={{
            fontWeight: '700',
            fontSize: '0.77rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '4',
            WebkitBoxOrient: 'vertical',
            paddingBottom: '0px',
            marginBottom: '8px',
          }}
        >
          {props.ticket.ticket_date}
        </Typography>
        <Button sx={{ fontSize: '0.6rem' }} href={props.ticket.link} target="_blank" variant="outlined">
          artist
        </Button>
      </Box>
    </Box>

    {props.showGenres && (
      <Box sx={{ height: '60px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            paddingBottom: '0px',
            marginBottom: '8px',
          }}
        >
          {props.ticket.genres}
        </Typography>
      </Box>
    )}
  </Card>
);
