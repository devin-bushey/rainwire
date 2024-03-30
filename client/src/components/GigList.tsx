import { GigCard } from "./GigCard";
import { COLOURS } from "../theme/AppStyles";
import { Gig } from "../types/Gig";
import { Error } from "./Error";

export const GigList = ({ gigs, cardColours }: { gigs: Gig[] | undefined; cardColours?: string[] }) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;

  console.log();

  if (!gigs || gigs.length === 0) return <Error />;

  const wrappedJsx = gigs.map((gig: Gig, index: number) => {
    return <GigCard gig={gig} bgcolor={colors[index % colors.length]} key={gig._id} />;
  });

  return <>{wrappedJsx}</>;
};
