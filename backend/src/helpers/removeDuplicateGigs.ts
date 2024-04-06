import _ from "lodash";
import { Gig } from "../types/Gig";

export const removeDuplicateGigs = (gigs: Gig[]) => {
  var cleaned: Gig[] = [];
  gigs.forEach(function (gig: Gig) {
    var unique = true;
    cleaned.forEach(function (itm2) {
      if (_.isEqual(gig.artist.name, gig.artist.name)) {
        unique = false;
      }
    });
    if (unique) cleaned.push(gig);
  });
  return cleaned;
};
