import { COLOURS } from '../theme/AppStyles';
import { Loading } from '../pages/Loading';
import { Ticket } from './Ticket';
import { Error } from './Error';
import blank from '../spotifyLogos/test.jpg';
import { JamBaseTicket } from './JamBaseTicket';

export const JamBaseTicketContainer = ({
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

  return tickets.map((currentTicket: any, index: any) => {
    let imageURL: any;
    try {
      imageURL = currentTicket.albumArtUrl || currentTicket.top_tracks[0].album.images[1].url;
    } catch {
      imageURL = blank;
    }

    return (
      <JamBaseTicket
        ticket={currentTicket}
        showGenres={showGenres}
        image={imageURL}
        bgcolor={colors[index % colors.length]}
        key={currentTicket.id}
      />
    );
  });
};
