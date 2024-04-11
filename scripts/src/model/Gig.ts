import { Artist, buildArtist } from "./Artist";

export type UnsavedGig = Omit<Gig, "_id">;

export interface Gig {
  _id?: string;
  artist: Artist;
  date: Date;
  venue: string;
  isMissing?: boolean;
  popularity?: number;
}

export const buildGig = (overrides: Partial<Gig> = {}): UnsavedGig => ({
  artist: buildArtist(overrides.artist),
  date: new Date(),
  venue: "",
  isMissing: false,
  popularity: 1,
  ...overrides,
});
