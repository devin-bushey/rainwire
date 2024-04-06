import { Gig } from "../types/Gig";

export const cachedGigs: {
  cachedGigsVictoria?: Gig[];
  cachedRifflandiaGigs?: Gig[];
} = {}; // The in-memory cache object
