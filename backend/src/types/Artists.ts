export interface Artist {
  artist: string;
  sp_band_name?: string;

  ticket_date: string;
  venue: string;
  date: string;
  day: string;
  popularity: number;

  albumArtUrl?: string;
  topTrackURIs?: string[];
  band_id?: string;
  link?: string;
  uri?: string;
}
