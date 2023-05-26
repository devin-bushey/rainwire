import { COLOURS } from '../theme/AppStyles';
import { Loading } from './Loading';
import { Ticket } from './Ticket';
import { Error } from './Error';

export const ticketContainer = ({
  tickets,
  showGenres,
  isLoadingTickets,
  isErrorTickets,
}: {
  tickets: any;
  showGenres: boolean;
  isLoadingTickets: boolean;
  isErrorTickets: boolean;
}) => {
  const colors = COLOURS.card_colours;

  if (isLoadingTickets) {
    return <Loading />;
  }

  if (isErrorTickets || tickets.length === 0) {
    return <Error />;
  }

  return tickets.map((currentTicket: any, index: any) => {
    let imageURL;
    try {
      imageURL = currentTicket.top_tracks[0].album.images[1].url;
    } catch {
      //TODO: find generic image
      imageURL = ' ';
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
