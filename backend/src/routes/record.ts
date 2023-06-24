import express from 'express';
import { updateCollectionWithSpotify } from '../db/addSpotifyDataToCollection';
export const recordRoutes = express.Router();
import dbo from '../db/conn';
import { extract } from '../extract_tickets';

import { Cities, Festivals } from '../enums/common';
import { CreateNewPlaylist } from '../createPlaylist';

import { extractRifflandia } from '../rifflandia/extract';
import { updateCollectionWithSpotify as updateCollectionWithSpotifyRifflandia } from '../rifflandia/addSpotifyDataToCollection';
import { RIFFLANDIA_SIMPLE, RIFFLANDIA_SPOTIFY } from '../rifflandia/constants';
import { CreateNewPlaylistRifflandia } from '../rifflandia/createPlaylist';

recordRoutes.route('/rifflandia-extract').get(async (req, res) => {
  console.log('Starting Web Scraping for Rifflandia');
  let status;
  try {
    status = await extractRifflandia();
  } catch (err) {
    console.log('Error /rifflandia-extract: ', err);
    status = 400;
  }
  res.status(status ? 200 : 400).send('Web Scraping Complete for Rifflandia');
});

recordRoutes.route('/rifflandia-spotify').get(async (req, res) => {
  console.log('Starting to add spotify data to Rifflandia');
  let db_connect = dbo.getDb();
  await updateCollectionWithSpotifyRifflandia(RIFFLANDIA_SIMPLE, db_connect);
  //res.status(status ? 200 : 400).send('Adding Spotify data for ' + collectionName + ' complete');
});

recordRoutes.route('/rifflandia').get(async (req, response) => {
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
      response.json(data);
    });
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

/**
 * Route to get all tickets from a city, inlcuding spotify data
 */
recordRoutes.route('/tickets').get(async (req, response) => {
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
    .collection(`db_${city}_spotify`)
    .find({})
    .toArray()
    .then((data: any) => {
      // console.log(`get db_${city}_spotify`);
      response.json(data);
    });
});

recordRoutes.route('/create').post(async (req, response) => {
  const { token, city, user_id, numTopTracks, tickets } = req.body;
  const url = await CreateNewPlaylist({
    token: token,
    city: city,
    user_id: user_id,
    numTopTracks: numTopTracks,
    tickets: tickets,
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

// Temp: used internally
recordRoutes.route('/tickets').post(async (req, response) => {
  const { city } = req.query;
  const tickets = req.body;

  const ticketArray: string[] = (tickets as string[]) || [];

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

  if (!ticketArray || ticketArray.length === 0) {
    db_connect
      .collection(`db_${city}_spotify`)
      .find({})
      .toArray()
      .then((data: any) => {
        // console.log(`get db_${city}_spotify`);
        response.json(data);
      });
  } else {
    db_connect
      .collection(`db_${city}_spotify`)
      .find({ ticket_band: { $in: ticketArray } })
      .toArray()
      .then((data: any) => {
        // console.log(`get db_${city}_spotify`);
        // console.log(`data ticketband:  ${data}`);
        response.json(data);
      });
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
//   const status = await extract(city as Cities | Festivals);
//   res.status(status ? 200 : 400).send('Web Scraping Complete for ' + city);
// });

// recordRoutes.route('/spotify').get(async (req, res) => {
//   const { collectionName } = req.query;
//   console.log('Starting to add spotify data to ' + collectionName);
//   let db_connect = dbo.getDb();
//   await updateCollectionWithSpotify(collectionName as string, db_connect);
//   //res.status(status ? 200 : 400).send('Adding Spotify data for ' + collectionName + ' complete');
// });
