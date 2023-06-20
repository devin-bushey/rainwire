import { COLOURS } from '../theme/AppStyles';
import { Loading } from './Loading';
import { Ticket } from './Ticket';
import { Error } from './Error';
import blank from '../spotifyLogos/test.jpg';

export const TicketContainer = ({
  tickets,
  showGenres,
  isLoadingTickets,
  isErrorTickets,
  cardColours,
}: {
  tickets: any;
  showGenres: boolean;
  isLoadingTickets: boolean;
  isErrorTickets: boolean;
  cardColours?: string[];
}) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;

  if (isLoadingTickets) {
    return <Loading />;
  }

  if (isErrorTickets || !tickets || tickets.length === 0) {
    return <Error />;
  }

  return tickets.map((currentTicket: any, index: any) => {
    let imageURL: any;
    try {
      imageURL = currentTicket.albumArtUrl || currentTicket.top_tracks[0].album.images[1].url;
    } catch {
      imageURL = blank;
    }

    return (
      <Ticket
        ticket={currentTicket}
        showGenres={showGenres}
        image={imageURL}
        bgcolor={colors[index % colors.length]}
        key={currentTicket._id}
      />
    );
  });
};
