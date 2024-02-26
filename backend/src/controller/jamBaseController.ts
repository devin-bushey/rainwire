import axios from 'axios';
import express, { response } from 'express';
import { CreateNewPlaylistJamBase } from '../helpers/createPlaylist';
import { Countries, States, Metros } from '../types/Geographies';

export const jamBaseRouter = express.Router();

const API_KEY_JAMBASE = process.env.API_KEY_JAMBASE || '';
const cachedData: {
  geo_countries?: Countries;
  geo_states?: States;
  geo_metros?: Metros;
} = {}; // The in-memory cache object

jamBaseRouter.route('/geographies/countries').get(async (req, res) => {
  if (cachedData.geo_countries) {
    res.json(cachedData.geo_countries);
  } else {
    const options = {
      method: 'GET',
      url: 'https://www.jambase.com/jb-api/v1/geographies/countries',
      params: {
        countryHasUpcomingEvents: 'true',
        apikey: API_KEY_JAMBASE,
      },
      headers: { Accept: 'application/json' },
    };

    try {
      const { data } = await axios.request(options);
      cachedData.geo_countries = {
        countries: data.countries,
      };
      res.json(cachedData.geo_countries);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Something went wrong' });
    }
  }
});

jamBaseRouter.route('/geographies/states').get(async (req, res) => {
  if (cachedData.geo_states) {
    res.json(cachedData.geo_states);
  } else {
    const options = {
      method: 'GET',
      url: 'https://www.jambase.com/jb-api/v1/geographies/states',
      params: { stateHasUpcomingEvents: 'true', apikey: API_KEY_JAMBASE },
      headers: { Accept: 'application/json' },
    };

    try {
      const { data } = await axios.request(options);
      cachedData.geo_states = {
        states: data.states,
      };
      res.json(cachedData.geo_states);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Something went wrong' });
    }
  }
});

jamBaseRouter.route('/geographies/metros').get(async (req, res) => {
  if (cachedData.geo_metros) {
    res.json(cachedData.geo_metros);
  } else {
    const options = {
      method: 'GET',
      url: 'https://www.jambase.com/jb-api/v1/geographies/metros',
      params: { metroHasUpcomingEvents: 'true', apikey: API_KEY_JAMBASE },
      headers: { Accept: 'application/json' },
    };

    try {
      const { data } = await axios.request(options);
      cachedData.geo_metros = {
        metros: data.metros,
      };
      res.json(cachedData.geo_metros);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Something went wrong' });
    }
  }
});

jamBaseRouter.route('/jamBase').get(async (req, response) => {
  const { city } = req.query;

  if (!city || city == null || city == '') {
    response.status(404).json('City not provided');
    return;
  }

  let cityId = null;

  try {
    cityId = await getCityId(city as string);
  } catch (err) {
    response.status(404).json('City not found');
    return;
  }

  if (!cityId || cityId == null) {
    response.status(404).json('City not found');
    return;
  }

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.jambase.com/jb-api/v1/events?apikey=${API_KEY_JAMBASE}&eventType=concert&geoCityId=${cityId}&geoRadiusAmount=30&geoRadiusUnits=km&expandExternalIdentifiers=true`,
  };

  try {
    const axiosResponse = await axios.request(config);
    const data = formatJamBase(axiosResponse.data);
    //console.log('****data ', data);
    response.json(data);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

const formatJamBase = (data: any) => {
  const responseObject: any = [];

  if (!data.events) {
    return responseObject; // Return an empty array if there are no events
  }

  data.events.forEach((event: any, index: number) => {
    event.performer.forEach((performer: any) => {
      let spotifyId = null;

      for (const externalIdentifier of performer['x-externalIdentifiers']) {
        if (externalIdentifier.source === 'spotify') {
          spotifyId = externalIdentifier.identifier[0];
        }
      }

      responseObject.push({
        id: spotifyId + index,
        artistName: performer.name,
        spotifyId: spotifyId,
        venue: event.location.name,
        date: formatDate(event.startDate),
        link: `https://open.spotify.com/artist/${spotifyId}`,
        image: performer.image,
        location: `${event.location.address.addressLocality}, ${event.location.address.addressRegion.alternateName}`,
      });
    });
  });

  return responseObject; // Return the responseObject
};

const formatDate = (utc: string) => {
  const inputDate = new Date(utc);
  const pacificTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedDate = pacificTimeFormatter.format(inputDate);
  return formattedDate;
};

const getCityId = async (requestedCity: string) => {
  //const city = requestedCity.replace(/\s/g, '');
  const city = requestedCity;

  const options = {
    method: 'GET',
    url: 'https://www.jambase.com/jb-api/v1/geographies/cities',
    params: { geoCityName: city, apikey: API_KEY_JAMBASE },
    headers: { Accept: 'application/json' },
  };

  return await axios.request(options).then((response: any) => {
    if (response.data.cities[0].identifier) {
      return response.data.cities[0].identifier;
    }

    return null;
  });
  // .catch((error: any) => {
  //   //console.log(`Error getting jam base getCityId for ${city}`);
  // });
};

jamBaseRouter.route('/createJamBase').post(async (req, response) => {
  const { token, city, user_id, numTopTracks, days } = req.body;

  if (!city || city == null || city == '') {
    response.status(404).json('City not provided');
    return;
  }

  const cityId = await getCityId(city);
  //console.log('******', cityId);

  if (!cityId || cityId == null) {
    response.status(404).json('City not found');
    return;
  }

  let artists: any[] = [];

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.jambase.com/jb-api/v1/events?apikey=${API_KEY_JAMBASE}&eventType=concert&geoCityId=${cityId}&geoRadiusAmount=30&geoRadiusUnits=km&expandExternalIdentifiers=true`,
  };

  try {
    const axiosResponse = await axios.request(config);
    artists = formatJamBase(axiosResponse.data);
  } catch (error) {
    //console.log(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }

  const spotifyIds: any = getJamBaseSpotifyIds(artists);

  const url = await CreateNewPlaylistJamBase({
    token: token,
    city: city,
    user_id: user_id,
    numTopTracks: numTopTracks,
    spotifyIds: spotifyIds,
  }).catch((error) => {
    console.log(error);
    response.status(500).json({ error: error.message });
  });

  if (url) {
    response.status(201).json(url);
  } else {
    response.status(500).json({ error: 'Something went wrong' });
  }
});

const getJamBaseSpotifyIds = (data: any) => {
  if (!data) {
    return []; // Return an empty array if there are no events
  }

  let spotifyIdList: any = [];

  data.forEach((artist: any) => {
    spotifyIdList.push(artist.spotifyId);
  });

  return spotifyIdList;
};
