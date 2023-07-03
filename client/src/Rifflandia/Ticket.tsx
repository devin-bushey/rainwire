import { Card, Typography, CardMedia } from '@mui/material';
import { Box } from '@mui/system';
import spotifyLogoBlack from '../spotifyLogos/Spotify_Logo_RGB_Black.png';
import { RIFFLANDIA_COLOURS } from './constants/colours';
import { useEffect, useState } from 'react';

export const Ticket = (props: any) => {
  const description = props.ticket.day ? `${props.ticket.day} at ${props.ticket.weekend}` : props.ticket.ticket_date;

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <Card
      sx={{
        backgroundColor: props.bgcolor,
        height: '150px',
        width: '300px',
        margin: '8px',
        '&:hover': {
          outline: `thick double ${RIFFLANDIA_COLOURS.dark_blue}`,
        },
      }}
      onClick={() => {
        isMobile ? window.location.assign(props.ticket.link) : window.open(props.ticket.link);
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'left' }}>
        <img
          src={spotifyLogoBlack}
          alt="spotify_logo"
          width="75px"
          height="22.48px"
          style={{ marginBottom: '12px' }}
          loading="lazy"
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CardMedia
          component="img"
          sx={{ display: 'inline-block', width: 60, height: 60, marginRight: '12px' }}
          image={props.image}
          alt="Album"
        />
        <Box sx={{ alignItems: 'center', textAlign: 'left' }}>
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: '1rem',
              paddingBottom: 0,
            }}
          >
            {props.ticket.sp_band_name}
          </Typography>

          <Box
            sx={{
              display: 'inline-block',
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
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
