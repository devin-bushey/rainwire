import { Box, Card, CardMedia, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { COLOURS } from '../theme/AppStyles';
import { Loading } from './Loading';

const DisplayTable = (data: any) => {
  if (data.tickets == null || data.tickets.length == 0) {
    return <Loading />;
  }

  return (
    <>
      <Container maxWidth="lg">
        <Card
          sx={{
            backgroundColor: COLOURS.light_pink,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: COLOURS.black, textAlign: 'center' }}>Tickets</Typography>
          <Button href={data.website} sx={{ alignContent: 'center', backgroundColor: COLOURS.yellow }}>
            click me to find tickets
          </Button>
        </Card>
      </Container>
      <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {ticketContainer(data.tickets)}
      </Container>
    </>
  );
};

const ticketContainer = (props: any) => {
  const colors = ['hsl(176, 52%, 80%)', 'hsl(284, 57%, 80%)', 'hsl(20, 49%, 80%)'];

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
      display: 'flex',
      backgroundColor: props.bgcolor,
      justifyContent: 'center',
      maxHeight: '300px',
      maxWidth: '300px',
      margin: '8px',
    }}
  >
    <CardMedia component="img" sx={{ width: 120, height: 120 }} image={props.image} alt="Ticket" />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px', textAlign: 'center' }}>
      <Typography color="secondary" sx={{ fontWeight: '700' }}>
        {props.ticket.ticket_band}
      </Typography>
      <Typography color="secondary" sx={{ fontSize: '0.9rem' }}>
        {props.ticket.ticket_date}
      </Typography>
      <Typography color="secondary" sx={{ fontSize: '0.9rem' }}>
        {props.ticket.ticket_price}
      </Typography>
      <Button href={props.ticket.link}>spotify</Button>
    </Box>
  </Card>
);

export default DisplayTable;
