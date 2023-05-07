import { Autocomplete, Box, Card, CardMedia, Container, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { SPOTIFY_PREVIEW_PLAYLIST_URL } from '../constants/constants';
import { COLOURS } from '../theme/AppStyles';
import { useEffect, useState } from 'react';
import spotifyLogoBlack from '../spotifyLogos/Spotify_Logo_RGB_Black.png';
import spotifyIconBlack from '../spotifyLogos/Spotify_Icon_RGB_Black.png';

const DisplayTable = (data: any) => {
  const loadInterval = 15;
  const [loadMore, setLoadMore] = useState(loadInterval);
  const first20Tickets = data.tickets.slice(0, loadMore);
  const [tickets, setTickets] = useState(first20Tickets);

  useEffect(() => {
    console.log(data.tickets);
    setTickets(data.tickets.slice(0, loadInterval));
    setLoadMore(loadInterval);
  }, [data.tickets]);

  useEffect(() => {
    setTickets(data.tickets.slice(0, loadMore));
  }, [loadMore]);

  return (
    <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
      <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
        Preview the artists playing in {data.city}
      </Typography>
      <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {ticketContainer(tickets)}
      </Container>
      {loadMore < data.tickets.length && (
        <Button
          variant="outlined"
          sx={{ marginTop: '24px' }}
          onClick={() => {
            setLoadMore(loadMore + loadInterval);
          }}
        >
          Load more
        </Button>
      )}
    </Box>
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
      height: '300px',
      width: '300px',
      margin: '8px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'left' }}>
      <img src={spotifyLogoBlack} alt="spotify_logo" width="75px" height="auto" style={{ marginBottom: '8px' }} />
    </Box>

    <Box sx={{ minHeight: '60px', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '1.25rem',
          textAlign: 'left',
          paddingBottom: '0px',
          marginBottom: '8px',
        }}
      >
        {props.ticket.sp_band_name}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardMedia component="img" sx={{ width: 120, height: 120 }} image={props.image} alt="Album" />
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
        {/* <Typography sx={{ fontSize: '0.9rem' }}>{props.ticket.ticket_price}</Typography> */}
        <Button href={props.ticket.link} target="_blank" variant="outlined">
          {/* <img src={spotifyIconBlack} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} /> */}
          artist
        </Button>
      </Box>
    </Box>
  </Card>
);

export default DisplayTable;
