import { Gig } from "../types/Gig";

export const filterRecent = (gigs: Gig[]) => {
  return gigs.filter((gig: Gig) => {
    const twoWeeksAgo: Date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const gigDate = new Date(gig.date);
    return gigDate > twoWeeksAgo;
  });
};
