import { Gig } from "../types/Gig";

export const sortByDateDescending = (gigs: Gig[]) => {
  return gigs.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
};
