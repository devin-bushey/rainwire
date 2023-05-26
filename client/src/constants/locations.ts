import { LocationType } from '../types/RecordShopTypes';
import { Cities, Festivals } from './enums';

export const WEBSITE_PHILIPS = 'https://www.phillipsbackyard.com/';
export const WEBSITE_WHISTLE = 'https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/';
export const WEBSITE_VICTORIA = 'https://victoriamusicscene.com/concerts/';
export const WEBSITE_VANCOUVER = 'https://www.ticketmaster.ca/discover/concerts/vancouver';
export const WEBSITE_LAKETOWN = 'https://www.laketownshakedown.com/';
export const WEBSITE_OSHEAGA = 'https://osheaga.com/en';
export const WEBSITE_COACHELLA = 'https://coachella.com/';
export const WEBSITE_RIFFLANDIA = 'https://rifflandia.com/';

export const LOCATIONS: LocationType[] = [
  {
    name: 'Phillips Backyard',
    value: Festivals.PhilipsBackyard,
    website: 'https://www.phillipsbackyard.com/',
  },
  {
    name: 'Rifflandia',
    value: Festivals.Rifflandia,
    website: 'https://rifflandia.com/',
  },
  {
    name: 'Whistlemania',
    value: Festivals.Whistlemania,
    website: 'https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/',
  },
  {
    name: 'Laketown Shakedown',
    value: Festivals.LaketownShakedown,
    website: 'https://www.laketownshakedown.com/',
  },
  {
    name: 'Osheaga',
    value: Festivals.Osheaga,
    website: 'https://osheaga.com/en',
  },
  {
    name: 'Coachella',
    value: Festivals.Coachella,
    website: 'https://coachella.com/',
  },
  {
    name: 'Victoria',
    value: Cities.Victoria,
    website: 'https://victoriamusicscene.com/concerts/',
  },
  {
    name: 'Vancouver',
    value: Cities.Vancouver,
    website: 'https://www.ticketmaster.ca/discover/concerts/vancouver',
  },
];
