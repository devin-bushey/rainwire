export interface Artist {
  id: string;
  name: string;
  topTracks: string[];
  uri: string;
  albumArtUrl: string;
  link: string;
}

export const buildArtist = (overrides: Partial<Artist> = {}): Artist => ({
  id: "",
  name: "",
  topTracks: [],
  uri: "",
  albumArtUrl: "",
  link: "",
  ...overrides,
});
