import { LocationType } from "../types/RecordShopTypes";
import { Cities, Festivals } from "./enums";

export const WEBSITE_PHILIPS = "https://www.phillipsbackyard.com/";
export const WEBSITE_WHISTLE = "https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/";
export const WEBSITE_VICTORIA = "https://victoriamusicscene.com/concerts/";
export const WEBSITE_VANCOUVER = "https://www.ticketmaster.ca/discover/concerts/vancouver";
export const WEBSITE_LAKETOWN = "https://www.laketownshakedown.com/";
export const WEBSITE_OSHEAGA = "https://osheaga.com/en";
export const WEBSITE_COACHELLA = "https://coachella.com/";
export const WEBSITE_RIFFLANDIA = "https://rifflandia.com/tickets/";

// This order of locations in this list corresponds to the order in the dropdown in the UI
export const LOCATIONS: LocationType[] = [
  {
    name: "Victoria, BC",
    value: Cities.Victoria,
    //website: 'https://victoriamusicscene.com/concerts/',
    //website: 'https://www.songkick.com/metro-areas/27399-canada-victoria',
    website:
      "https://www.jambase.com/concerts/finder?location=Victoria%2C%20British%20Columbia%2C%20CA&lat=48.4235&lng=-123.3625&radius=10",
    location: "Victoria, BC",
  },
  // {
  //   name: 'Vancouver, BC',
  //   value: Cities.Vancouver,
  //   website: 'https://www.ticketmaster.ca/discover/concerts/vancouver',
  //   location: 'Vancouver, BC',
  // },
  {
    name: "Phillips Backyard",
    value: Festivals.PhilipsBackyard,
    website: "https://www.phillipsbackyard.com/",
    location: "Victoria, BC",
  },
  {
    name: "The Function",
    value: Festivals.TheFunction,
    website: "https://www.functionfestival.com/",
    location: "Ship Point",
  },
  {
    name: "Rifflandia",
    value: Festivals.Rifflandia,
    website: "https://rifflandia.com/tickets/",
    location: "Victoria, BC",
  },
  {
    name: "Whistlemania",
    value: Festivals.Whistlemania,
    website: "https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/",
    location: "Victoria, BC",
  },
  // {
  //   name: "Laketown Shakedown",
  //   value: Festivals.LaketownShakedown,
  //   website: "https://www.laketownshakedown.com/",
  //   location: "Cowichan, BC",
  // },
  {
    name: "Laketown Shakedown 2024",
    value: Festivals.LaketownShakedown_2024,
    website: "https://www.laketownshakedown.com/",
    location: "Laketown Ranch",
  },
  // {
  //   name: 'Osheaga',
  //   value: Festivals.Osheaga,
  //   website: 'https://osheaga.com/en',
  //   location: 'Montreal, QC',
  // },
  // {
  //   name: 'Coachella',
  //   value: Festivals.Coachella,
  //   website: 'https://coachella.com/',
  //   location: 'California, US',
  // },
];
