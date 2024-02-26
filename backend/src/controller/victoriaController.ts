import express from 'express';
export const victoriaRouter = express.Router();
import dbo from '../database/conn';

import { CreateNewPlaylist } from '../helpers/createPlaylist';

import { Cities } from '../enums/Cities';

const cachedData: {
  victoria_data?: any;
} = {}; // The in-memory cache object

victoriaRouter.route('/artists').get(async (req, response) => {
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

victoriaRouter.route('/create').post(async (req, response) => {
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

// victoriaRouter.route('/extract').get(async (req, res) => {
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

// victoriaRouter.route('/spotify').get(async (req, res) => {
//   const { collectionName } = req.query;
//   console.log('Starting to add spotify data to ' + collectionName + '_simple');
//   let db_connect = dbo.getDb();
//   await updateCollectionWithSpotify(collectionName as string, db_connect);
// });
