import { Gig } from "../types/Gig";

export const sortByPopularity = (gigs: Gig[]): Gig[] => {
  gigs.sort((a: Gig, b: Gig) => {
    return a.popularity - b.popularity;
  });

  return gigs;
};
