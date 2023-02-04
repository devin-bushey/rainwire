import express from 'express';
import { manualRun } from '../db/addSpotifyDataToCollection';
export const recordRoutes = express.Router();
import { getDb } from '../db/conn';
import { extract } from '../extract_tickets';

recordRoutes.route('/victoria').get(function (req, res) {
  let db_connect = getDb();

  db_connect
    .collection('db_victoria_spotify')
    .find({})
    .toArray(function (err: any, result: any) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route('/webscrape').get(async function (req, res) {
  const date = getTodaysDate();

  let db_connect = getDb();

  db_connect
    .collection('db_victoria_spotify')
    .drop()
    .then(function () {
      console.log('db_victoria_spotify DROPPED');
      // success
    })
    .catch(function () {
      console.log('ERROR db_victoria_spotify NOT DROPPED');
      // error handling
    })
    .then(function () {
      db_connect
        .collection('db_victoria_' + date)
        .drop()
        .then(function () {
          console.log('db_victoria_' + date + ' DROPPED');
          // success
        })
        .catch(function () {
          console.log('ERROR db_victoria_' + date + ' NOT DROPPED');
          // error handling
        });
    })
    .then(function () {
      console.log('Starting Web Scraping');
      extract();
    });

  res.json('Web Scraping Done!');
});

recordRoutes.route('/addspotify').get(async function (req, res) {
  const date = getTodaysDate();

  manualRun('db_victoria_' + date);

  res.json('Added Spotify Data!');
});

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return mm + '-' + dd + '-' + yyyy;
}
