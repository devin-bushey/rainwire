export interface Gig {
  artist: Artist;
  date: string;
  isMissing?: boolean; // TODO: can be undefined?
}

interface Artist {
  id: string;
  name: string;
  topTracks: string[];
  uri: string;
  albumArtUrl: string;
  link: string;
}
