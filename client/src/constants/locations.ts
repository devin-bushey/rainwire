import { LocationType } from "../types/RecordShopTypes";
import { Cities, Festivals } from "./enums";

export const WEBSITE_VICTORIA = "https://victoriamusicscene.com/concerts/";
export const WEBSITE_LAKETOWN = "https://www.laketownshakedown.com/";
export const WEBSITE_RIFFLANDIA = "https://rifflandia.com/tickets/";
export const WEBSITE_PACHENA_BAY = "https://www.pachenabaymusicfestival.com/tickets";

// This order of locations in this list corresponds to the order in the dropdown in the UI
export const LOCATIONS: LocationType[] = [
  {
    name: "Victoria, BC",
    value: Cities.Victoria_2024,
  },
  {
    name: "Laketown Shakedown",
    value: Festivals.LaketownShakedown_2024,
  },
  {
    name: "Pachena Bay",
    value: Festivals.PachenaBay,
  },
];
