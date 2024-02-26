// TODO: This is the ideal data model, should use this instead of Artists.ts
export interface Artist {
  name: string;
  date: string;
  venue: string;
  popularity?: number;

  spotify: {
    albumArtUrl: string;
    artistId: string;
    link: string;
    topTrackURIs: string[];
  };
}
