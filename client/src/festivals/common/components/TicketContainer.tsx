import { Ticket } from "./Ticket";
import { COLOURS } from "../../../theme/AppStyles";

export const TicketContainer = ({
  tickets,
  cardColours,
  token,
  playlistId,
}: {
  tickets: any;
  cardColours?: string[];
  token?: string;
  playlistId?: string;
}) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;

  if (!tickets) return null;

  return tickets.map((currentTicket: any, index: any) => {
    return (
      <Ticket
        ticket={currentTicket}
        image={""}
        bgcolor={colors[index % colors.length]}
        key={currentTicket._id}
        token={token}
        playlistId={playlistId}
      />
    );
  });
};
