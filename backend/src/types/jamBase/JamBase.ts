export type JamBaseRequestBody = {
  eventType: "concerts" | "festivals";
  city: string;
  geoCountryIso2?: string;
  geoCountryIso3?: string;
  geoMetroId?: string;
  geoStateIso?: string;
  geoRadiusAmount?: number;
};
