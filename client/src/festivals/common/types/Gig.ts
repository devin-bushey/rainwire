export interface Gig {
  artist: Artist;
  date: string;
  isMissing?: boolean; // TODO: can be undefined?

  // TODO: Remove these old types
  topTrackURIs: string[];
}

interface Artist {
  id: string;
  name: string;
  topTracks: string[];
  uri: string;
  albumArtUrl: string;
  link: string;
}
