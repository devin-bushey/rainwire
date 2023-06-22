import { Card, Typography, CardMedia, Button } from '@mui/material';
import { Box } from '@mui/system';
import spotifyLogoBlack from '../../spotifyLogos/Spotify_Logo_RGB_Black.png';
import { useNavigate } from 'react-router-dom';
import { RIFFLANDIA_COLOURS } from './colours';

export const Ticket = (props: any) => {
  const description = props.ticket.day ? `${props.ticket.day} at ${props.ticket.weekend}` : props.ticket.ticket_date;

  return (
    <Card
      sx={{
        backgroundColor: props.bgcolor,
        height: '150px',
        width: '300px',
        margin: '8px',
        '&:hover': {
          outline: `thick double ${RIFFLANDIA_COLOURS.dark_blue}`,
          // background: RIFFLANDIA_COLOURS.dark_blue,
          // color: 'white',
        },
      }}
      onClick={() => {
        window.open(props.ticket.link, '_blank');
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
          alignItems: 'center', // Vertically center the items
          //margin: '8px',
          //width: '100px',
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
              //margin: '8px',
              //width: '102px',
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
