export interface Gig {
  artist: Artist;
  date: string;
  venue: string;
  isMissing?: boolean; // TODO: should this be optional?

  // TODO: Remove these old types
  topTrackURIs: string[];
  sp_band_name: string;
}

interface Artist {
  id: string;
  name: string;
  topTracks: string[];
  uri: string;
  albumArtUrl: string;
  link: string;
}
