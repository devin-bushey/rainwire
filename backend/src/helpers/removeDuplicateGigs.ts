import _ from "lodash";
import { Gig } from "../types/Gig";

export const removeDuplicateGigs = (gigs: Gig[]) => {
  const cleaned: Gig[] = [];
  gigs.forEach((gig: Gig) => {
    let unique = true;
    cleaned.forEach(function (gig2) {
      if (_.isEqual(gig.artist.name, gig2.artist.name)) {
        unique = false;
      }
    });
    if (unique) cleaned.push(gig);
  });
  return cleaned;
};
