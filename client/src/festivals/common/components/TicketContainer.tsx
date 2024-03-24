import { Ticket } from "./Ticket";
import { Error } from "./Error";
import { COLOURS } from "../../../theme/AppStyles";
import { Loading } from "./Loading";

export const TicketContainer = ({
  tickets,
  isLoadingTickets,
  isErrorTickets,
  cardColours,
  playlistId,
}: {
  tickets: any;
  isLoadingTickets: boolean;
  isErrorTickets: boolean;
  cardColours?: string[];
  playlistId?: string;
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
      imageURL = "";
    }

    return (
      <Ticket
        ticket={currentTicket}
        image={imageURL}
        bgcolor={colors[index % colors.length]}
        key={currentTicket._id}
        playlistId={playlistId}
      />
    );
  });
};
