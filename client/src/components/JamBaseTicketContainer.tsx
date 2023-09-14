import { COLOURS } from '../theme/AppStyles';
import blank from '../spotifyLogos/test.jpg';
import { JamBaseTicket } from './JamBaseTicket';

export const JamBaseTicketContainer = ({ tickets, cardColours }: { tickets: any; cardColours?: string[] }) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;

  return tickets.map((currentTicket: any, index: any) => {
    return (
      <JamBaseTicket ticket={currentTicket} bgcolor={colors[index % colors.length]} key={currentTicket.id + index} />
    );
  });
};
