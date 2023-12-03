export type Country = {
  '@type': 'Country';
  identifier: String;
  name: String;
  alternateName: String;
  'x-numUpcomingEvents': Number;
};

export type Countries = {
  countries: Country[];
};

export type State = {
  '@type': 'State';
  identifier: String;
  name: String;
  alternateName: String;
  country: Country;
  'x-numUpcomingEvents': Number;
};

export type States = {
  states: State[];
};

export type Metro = {
  '@type': 'AdministrativeArea';
  identifier: String;
  name: String;
  geo: {
    '@type': 'GeoCoordinates';
    latitude: Number;
    longitude: Number;
  };
  address: {
    addressRegion: String;
    addressCountry: String;
  };
  containsPlace: [
    {
      '@type': 'City';
      identifier: String;
      name: String;
      geo: {
        '@type': 'GeoCoordinates';
        latitude: Number;
        longitude: Number;
      };
      address: {
        addressRegion: String;
        addressCountry: String;
      };
      'x-timezone': String;
      containedInPlace: {};
      'x-numUpcomingEvents': Number;
    },
  ];
  'x-primaryCityId': String;
  'x-numUpcomingEvents': String;
};

export type Metros = {
  metros: Metro[];
};
