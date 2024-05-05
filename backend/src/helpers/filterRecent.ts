import { Gig } from "../types/Gig";

export const filterRecent = (gigs: Gig[]) => {
  return gigs.filter((gig: Gig) => {
    const oneWeekAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const gigDate = new Date(gig.date);
    return gigDate > oneWeekAgo;
  });
};
