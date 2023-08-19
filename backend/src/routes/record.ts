import express from 'express';
export const recordRoutes = express.Router();
import dbo from '../db/conn';

import { CreateNewPlaylist } from '../helpers/createPlaylist';

import { RIFFLANDIA_SPOTIFY } from '../rifflandia/constants';
import { CreateNewPlaylistRifflandia } from '../rifflandia/createPlaylist';
import { updateCollectionWithSpotify } from '../db/addSpotifyDataToCollection';
import { Cities, Festivals } from '../enums/common';
import { extract } from '../extract_tickets';

const cachedData: { rifflandia_data?: any } = {}; // The in-memory cache object

recordRoutes.route('/artists').get(async (req, response) => {
  const { city } = req.query;
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
      response.json(data);
    });
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
    console.log('cache not found for /rifflandia: ', cachedData);

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
