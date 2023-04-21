import { Autocomplete, Box, Card, CardMedia, Container, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { SPOTIFY_PREVIEW_PLAYLIST_URL } from '../constants/constants';
import { COLOURS } from '../theme/AppStyles';
import { useEffect, useState } from 'react';
import spotifyLogo from '../spotifyLogos/Spotify_Logo_RGB_Black.png';
import spotifyIconBlack from '../spotifyLogos/Spotify_Icon_RGB_Black.png';

const DisplayTable = (data: any) => {
  console.log(data);

  const [tickets, setTickets] = useState(data.tickets);
  const [filteredGenres, setFilteredGenres] = useState<any[]>();

  const genres: any = [];
  data.tickets.forEach((ticket: any) => {
    if (ticket?.genres === undefined) return;
    ticket.genres.forEach((genre: any) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });

  useEffect(() => {
    if (filteredGenres === undefined) {
      setTickets(data.tickets);
      return;
    }

    const filteredTickets = data.tickets.filter((ticket: any) => {
      let isFound = false;
      console.log(ticket);
      if (ticket?.genres === undefined) return false;
      ticket.genres.forEach((genre: any) => {
        if (filteredGenres.includes(genre)) {
          isFound = true;
        }
      });
      return isFound;
    });

    setTickets(filteredTickets);
  }, [filteredGenres]);

  console.log(genres);

  return (
    <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
      {/* <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
        <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
          Tickets
        </Typography>
        <Button href={data.website} variant="outlined">
          click me to find tickets
        </Button>
      </Box>
      */}
      {/* <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
        <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
          Preview playlist
        </Typography>
        <Button href={SPOTIFY_PREVIEW_PLAYLIST_URL} target="_blank" variant="outlined" sx={{ padding: '12px 24px' }}>
          <img src={spotifyLogo} alt="spotify_logo" width="100px" height="auto" />
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
        <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
          Filter Artists by Genre
        </Typography>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <Autocomplete
            value={filteredGenres}
            onChange={(event, newValue) => {
              setFilteredGenres(newValue);
            }}
            multiple
            id="tags-standard"
            options={genres}
            getOptionLabel={(option: string) => option}
            renderInput={(params) => <TextField {...params} variant="standard" placeholder="Genres" />}
          />
        </Grid>
      </Box>
      </Box> */}
      <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
        Preview the artists playing in Victoria
      </Typography>
      <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {ticketContainer(tickets)}
      </Container>
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
        {props.ticket.sp_band_name}
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
          {/* <img src={spotifyIconBlack} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} /> */}
          artist
        </Button>
      </Box>
    </Box>
  </Card>
);

export default DisplayTable;
