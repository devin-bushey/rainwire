import { Cities, Festivals } from "../constants/enums";

export interface LocationType {
  name: string;
  value: Cities | Festivals;
}
