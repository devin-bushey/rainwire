import { Artist, buildArtist } from "./Artist";

export interface Gig {
  _id: string;
  artist: Artist;
  date: Date;
  venue: string;
  isMissing?: boolean;
  popularity?: number;
}

export const buildGig = (overrides: Partial<Gig> = {}) => ({
  artist: buildArtist(overrides.artist),
  date: new Date(),
  venue: "",
  isMissing: false,
  popularity: 1,
  ...overrides,
});
