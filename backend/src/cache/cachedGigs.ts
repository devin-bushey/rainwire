import { Gig } from "../types/Gig";

export const cachedData: {
  cachedVictoria?: Gig[];
  cachedRifflandia?: Gig[];
} = {}; // The in-memory cache object
