import { GigCard } from "./GigCard";
import { COLOURS } from "../../../theme/AppStyles";
import { Gig } from "../types/Gig";

export const GigList = ({
  gigs,
  cardColours,
  playlistId,
}: {
  gigs: Gig[];
  cardColours?: string[];
  playlistId?: string;
}) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;

  if (!gigs) return null;

  const wrappedJsx = gigs.map((gig: Gig, index: number) => {
    return <GigCard gig={gig} bgcolor={colors[index % colors.length]} key={gig._id} playlistId={playlistId} />;
  });

  return <>{wrappedJsx}</>;
};
