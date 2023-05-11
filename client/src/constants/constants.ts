import { LocationType } from '../types/RecordShopTypes';
import { Cities, Festivals } from './enums';

// URL for Devin's Spotify playlist:
export const SPOTIFY_PREVIEW_PLAYLIST_URL = import.meta.env.VITE_SPOTIFY_PREVIEW_PLAYLIST_URL;

// export const LOCATIONS = [
//   'philipsBackyard',
//   //"rifflandia",
//   'whistlemania',
//   'victoria',
//   'vancouver',
// ];

export const LOCATIONS: LocationType[] = [
  {
    name: 'Philips Backyard',
    value: Festivals.PhilipsBackyard,
  },
  {
    name: 'Rifflandia',
    value: Festivals.Rifflandia,
  },
  {
    name: 'Whistlemania',
    value: Festivals.Whistlemania,
  },
  {
    name: 'Victoria',
    value: Cities.Victoria,
  },
  {
    name: 'Vancouver',
    value: Cities.Vancouver,
  },
];
