import { GigCard } from "./GigCard";
import { COLOURS } from "../../../theme/AppStyles";

export const GigList = ({
  gigs,
  cardColours,
  playlistId,
}: {
  gigs: any;
  cardColours?: string[];
  playlistId?: string;
}) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;

  if (!gigs) return null;

  return gigs.map((gig: any, index: any) => {
    return <GigCard gig={gig} bgcolor={colors[index % colors.length]} key={gig._id} playlistId={playlistId} />;
  });
};
