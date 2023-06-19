import { LocationType } from '../types/RecordShopTypes';
import { Cities, Festivals } from './enums';

export const WEBSITE_PHILIPS = 'https://www.phillipsbackyard.com/';
export const WEBSITE_WHISTLE = 'https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/';
export const WEBSITE_VICTORIA = 'https://victoriamusicscene.com/concerts/';
export const WEBSITE_VANCOUVER = 'https://www.ticketmaster.ca/discover/concerts/vancouver';
export const WEBSITE_LAKETOWN = 'https://www.laketownshakedown.com/';
export const WEBSITE_OSHEAGA = 'https://osheaga.com/en';
export const WEBSITE_COACHELLA = 'https://coachella.com/';
export const WEBSITE_RIFFLANDIA = 'https://rifflandia.com/tickets/';

export const LOCATIONS: LocationType[] = [
  {
    name: 'Phillips Backyard',
    value: Festivals.PhilipsBackyard,
    website: 'https://www.phillipsbackyard.com/',
    location: 'Victoria, BC',
  },
  {
    name: 'Rifflandia',
    value: Festivals.Rifflandia,
    website: 'https://rifflandia.com/tickets/',
    location: 'Victoria, BC',
  },
  {
    name: 'Whistlemania',
    value: Festivals.Whistlemania,
    website: 'https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/',
    location: 'Victoria, BC',
  },
  {
    name: 'Laketown Shakedown',
    value: Festivals.LaketownShakedown,
    website: 'https://www.laketownshakedown.com/',
    location: 'Cowichan, BC',
  },
  {
    name: 'Osheaga',
    value: Festivals.Osheaga,
    website: 'https://osheaga.com/en',
    location: 'Montreal, QC',
  },
  {
    name: 'Coachella',
    value: Festivals.Coachella,
    website: 'https://coachella.com/',
    location: 'California, US',
  },
  {
    name: 'Victoria, BC',
    value: Cities.Victoria,
    website: 'https://victoriamusicscene.com/concerts/',
    location: 'Victoria, BC',
  },
  {
    name: 'Vancouver, BC',
    value: Cities.Vancouver,
    website: 'https://www.ticketmaster.ca/discover/concerts/vancouver',
    location: 'Vancouver, BC',
  },
];
