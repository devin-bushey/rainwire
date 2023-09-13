import express, { response } from 'express';
export const recordRoutes = express.Router();
import dbo from '../db/conn';

import { CreateNewPlaylist, CreateNewPlaylistJamBase } from '../helpers/createPlaylist';

import { RIFFLANDIA_SPOTIFY } from '../rifflandia/constants';
import { CreateNewPlaylistRifflandia } from '../rifflandia/createPlaylist';
import { updateCollectionWithSpotify } from '../db/addSpotifyDataToCollection';
import { Cities, Festivals } from '../enums/common';
import { extract } from '../extract_tickets';
import { Artist } from '../types/Artists';

const axios = require('axios');
const API_KEY_JAMBASE = process.env.API_KEY_JAMBASE || '';
const cachedData: { victoria_data?: any; rifflandia_data?: any } = {}; // The in-memory cache object

recordRoutes.route('/jamBase').get(async (req, response) => {
  const { city } = req.query;

  if (!city || city == null || city == '') {
    response.status(404).json('City not provided');
    return;
  }

  const cityId = await getCityId(city as string);

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

  return await axios
    .request(options)
    .then((response: any) => {
      if (response.data.cities[0].identifier) {
        return response.data.cities[0].identifier;
      }

      return null;
    })
    .catch((error: any) => {
      console.log(`Error getting jam base getCityId for ${city}`);
    });
};

recordRoutes.route('/createJamBase').post(async (req, response) => {
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

recordRoutes.route('/artists').get(async (req, response) => {
  const { city } = req.query;

  if (city === Cities.Victoria && cachedData.victoria_data) {
    response.json(cachedData.victoria_data);
  } else {
    if (city === Cities.Victoria) console.log('cache not found for /victoria: ', cachedData.victoria_data);

    let db_connect = dbo.getDb();

    if (!db_connect) {
      console.log('reconnecting to db');
      await dbo.connectToServer(function (err: any) {
        if (err) {
          console.log('reconnecting error');
          console.error(err);
        }
      });
      db_connect = dbo.getDb();
    }

    db_connect
      .collection(`${city}`)
      .find({})
      .toArray()
      .then((data: any) => {
        // Save the fetched data to cache
        if (city === Cities.Victoria) {
          cachedData.victoria_data = data;
        }
        response.json(data);
      });
  }
});

recordRoutes.route('/create').post(async (req, response) => {
  const { token, city, user_id, numTopTracks, days } = req.body;

  let db_connect = dbo.getDb();

  if (!db_connect) {
    console.log('reconnecting to db');
    await dbo.connectToServer(function (err: any) {
      if (err) {
        console.log('reconnecting error');
        console.error(err);
      }
    });
    db_connect = dbo.getDb();
  }

  let dayQuery;
  let sortBy;

  if (!days || days.length === 0) {
    // TODO: can change to 'popularity'
    sortBy = 'date';
    dayQuery = {};
  } else {
    sortBy = 'day';
    dayQuery = {
      day: {
        $in: days,
      },
    };
  }

  const artists = await db_connect.collection(city).find(dayQuery).toArray();

  const url = await CreateNewPlaylist({
    token: token,
    city: city,
    user_id: user_id,
    numTopTracks: numTopTracks,
    artists: artists,
    sortBy: sortBy,
    days: days,
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

recordRoutes.route('/rifflandia').get(async (req, response) => {
  // Check if data is cached in memory
  if (cachedData.rifflandia_data) {
    // If data is found in cache, return the cached data
    response.json(cachedData.rifflandia_data);
  } else {
    console.log('cache not found for /rifflandia: ', cachedData.rifflandia_data);

    let db_connect = dbo.getDb();

    if (!db_connect) {
      console.log('reconnecting to db');
      await dbo.connectToServer(function (err: any) {
        if (err) {
          console.log('reconnecting error');
          console.error(err);
        }
      });
      db_connect = dbo.getDb();
    }

    db_connect
      .collection(`rifflandia`)
      .find({})
      .toArray()
      .then((data: any) => {
        // Save the fetched data to cache
        cachedData.rifflandia_data = data;
        response.json(data);
      });
  }
});

recordRoutes.route('/rifflandia-create').post(async (req, response) => {
  const { token, user_id, numTopTracks, days } = req.body;

  let db_connect = dbo.getDb();

  if (!db_connect) {
    console.log('reconnecting to db');
    await dbo.connectToServer(function (err: any) {
      if (err) {
        console.log('reconnecting error');
        console.error(err);
      }
    });
    db_connect = dbo.getDb();
  }

  let dayQuery;
  let sortBy;

  if (!days || days.length === 0) {
    sortBy = 'orderNum';
    dayQuery = {};
  } else {
    sortBy = 'day';
    dayQuery = {
      day: {
        $in: days,
      },
    };
  }

  const artists = await db_connect.collection(RIFFLANDIA_SPOTIFY).find(dayQuery).toArray();

  const url = await CreateNewPlaylistRifflandia({
    token: token,
    user_id: user_id,
    numTopTracks: numTopTracks,
    artists: artists,
    sortBy: sortBy,
    days: days,
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

// recordRoutes.route('/drop').get(async (req, res) => {
//   const { collectionName } = req.query;

//   let db_connect = dbo.getDb();

//   await db_connect
//     .collection(collectionName)
//     .drop()
//     .then(() => {
//       console.log(collectionName + ' DROPPED');
//       res.status(200).send(collectionName + ' DROPPED');
//       // success
//     })
//     .catch(() => {
//       console.log('ERROR: ' + collectionName + ' NOT DROPPED');
//       res.status(400).send('ERROR: ' + collectionName + ' NOT DROPPED');
//       // error handling
//     });
// });

// recordRoutes.route('/extract').get(async (req, res) => {
//   const { city } = req.query;
//   console.log('Starting Web Scraping for ' + city);
//   let status;
//   try {
//     status = await extract(city as Cities | Festivals);
//   } catch (err) {
//     console.log('Error /extract: ', err);
//     status = 400;
//   }
//   res.status(status ? 200 : 400).send('Web Scraping Complete for ' + city);
// });

// recordRoutes.route('/spotify').get(async (req, res) => {
//   const { collectionName } = req.query;
//   console.log('Starting to add spotify data to ' + collectionName + '_simple');
//   let db_connect = dbo.getDb();
//   await updateCollectionWithSpotify(collectionName as string, db_connect);
// });
