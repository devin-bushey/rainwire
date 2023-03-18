import { Box, Card, CardMedia, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { SPOTIFY_PREVIEW_PLAYLIST_URL } from '../constants/constants';
import { COLOURS } from '../theme/AppStyles';

const DisplayTable = (data: any) => {
  return (
    <>
      <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
        <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
          Tickets
        </Typography>
        <Button href={data.website} variant="outlined">
          click me to find tickets
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
        <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
          Preview playlist
        </Typography>
        <Button href={SPOTIFY_PREVIEW_PLAYLIST_URL} target="_blank" variant="contained">
          spotify
        </Button>
      </Box>
      <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {ticketContainer(data.tickets)}
      </Container>
    </>
  );
};

const ticketContainer = (props: any) => {
  const colors = COLOURS.card_colours;

  return props.map((currentTicket: any, index: any) => {
    let imageURL;
    try {
      imageURL = currentTicket.top_tracks[0].album.images[1].url;
    } catch {
      //TODO: find generic image
      imageURL = ' ';
    }

    return (
      <Ticket ticket={currentTicket} image={imageURL} bgcolor={colors[index % colors.length]} key={currentTicket._id} />
    );
  });
};

const Ticket = (props: any) => (
  <Card
    sx={{
      backgroundColor: props.bgcolor,
      height: '260px',
      width: '300px',
      margin: '8px',
    }}
  >
    <Box sx={{ minHeight: '60px', marginBottom: '18px', display: 'flex', alignItems: 'center' }}>
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '1.25rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          paddingBottom: '0px',
          marginBottom: '8px',
        }}
      >
        {props.ticket.ticket_band}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 120, borderRadius: '4px' }}
        image={props.image}
        alt="Album"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '8px',
          textAlign: 'center',
          alignContent: 'space-between',
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
        <Typography sx={{ fontSize: '0.9rem' }}>{props.ticket.ticket_price}</Typography>
        <Button href={props.ticket.link} target="_blank" variant="outlined">
          spotify
        </Button>
      </Box>
    </Box>
  </Card>
);

export default DisplayTable;
