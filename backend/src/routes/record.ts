import express from 'express';
import { updateCollectionWithSpotify } from '../db/addSpotifyDataToCollection';
export const recordRoutes = express.Router();
import dbo from '../db/conn';
import { extract } from '../extract_tickets';
import { Cities, Festivals } from '../enums/common';

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

  if (db_connect) {
    console.log('db connected');
  }

  db_connect
    .collection(`db_${city}_spotify`)
    .find({})
    .toArray()
    .then((data: any) => {
      console.log(`get db_${city}_spotify`);
      response.json(data);
    });
});

recordRoutes.route('/drop').get(async (req, res) => {
  const { collectionName } = req.query;

  let db_connect = dbo.getDb();

  await db_connect
    .collection(collectionName)
    .drop()
    .then(() => {
      console.log(collectionName + ' DROPPED');
      res.status(200).send(collectionName + ' DROPPED');
      // success
    })
    .catch(() => {
      console.log('ERROR: ' + collectionName + ' NOT DROPPED');
      res.status(400).send('ERROR: ' + collectionName + ' NOT DROPPED');
      // error handling
    });
});

recordRoutes.route('/extract').get(async (req, res) => {
  const { city } = req.query;
  console.log('Starting Web Scraping for ' + city);
  const status = await extract(city as Cities | Festivals);
  res.status(status ? 200 : 400).send('Web Scraping Complete for ' + city);
});

recordRoutes.route('/spotify').get(async (req, res) => {
  const { collectionName } = req.query;
  console.log('Starting to add spotify data to ' + collectionName);
  let db_connect = dbo.getDb();
  await updateCollectionWithSpotify(collectionName as string, db_connect);
  //res.status(status ? 200 : 400).send('Adding Spotify data for ' + collectionName + ' complete');
});
