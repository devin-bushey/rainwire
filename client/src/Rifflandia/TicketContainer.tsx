import blank from "../spotifyLogos/test.jpg";
import { Loading } from "../pages/Loading";
import { Error } from "../components/Error";
import { COLOURS } from "../theme/AppStyles";
import { Ticket } from "./Ticket";

export const TicketContainer = ({
  tickets,
  isLoadingTickets,
  isErrorTickets,
  cardColours,
  spotifyPreviewArtistId,
}: {
  tickets: any;
  isLoadingTickets: boolean;
  isErrorTickets: boolean;
  cardColours?: string[];
  spotifyPreviewArtistId: (artistId: string) => void;
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
        key={currentTicket._id}
        ticket={currentTicket}
        image={imageURL}
        bgcolor={colors[index % colors.length]}
        setSpotifyPreviewArtistId={setSpotifyPreviewArtistId}
      />
    );
  });
};
