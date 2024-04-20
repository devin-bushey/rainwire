export interface Gig {
  _id: string;
  artist: Artist;
  date: string;
  venue: string;
  isMissing?: boolean; // TODO: should this be optional?
  popularity?: number;
}

export interface Artist {
  id: string;
  name: string;
  topTracks: string[];
  uri: string;
  albumArtUrl: string;
  link: string;
  bio?: string;
}
