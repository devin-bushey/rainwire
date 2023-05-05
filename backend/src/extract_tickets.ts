require('dotenv').config({ path: './config.env' });
import dbo from './db/conn';
import _ from 'lodash';

import { extract_vic_songkick_1 } from './extraction_scripts/extract_vic_songkick';
import { extract_vic_songkick_2 } from './extraction_scripts/extract_vic_songkick_page2';

import { addSimpleDataToCollection } from './db/addSimpleDataToCollection';
import { extract_capital_ballroom } from './extraction_scripts/extract_capital_ballroom';
import { extract_philips_backyarder } from './extraction_scripts/extract_philips_backyarder';
import { extract_vancouver } from './extraction_scripts/extract_vancouver';
import { extract_van_songkick_1 } from './extraction_scripts/extract_van_songkick';
import { extract_van_songkick_2 } from './extraction_scripts/extract_van_songkick_page2';
import { manualRun, updateCollectionWithSpotify } from './db/addSpotifyDataToCollection';

export async function extract() {
  dbo.connectToServer(function (err: any) {
    if (err) {
      console.error('Connect to Server Error on Extract', err);
    } else {
      extractTickets();
    }
  });
}

export async function extractTickets() {
  let date = getTodaysDate();
  let db_connect = dbo.getDb();

  //
  // ***** VICTORIA *****
  //
  // extract from record shop website
  let tickets_victoria: any[] = [];
  let tickets_philips_backyarder = await extract_philips_backyarder();
  let tickets_vic_spotify = await extract_capital_ballroom();
  let tickets_vic_songkick_1 = await extract_vic_songkick_1(); //page one of songkick
  let tickets_vic_songkick_2 = await extract_vic_songkick_2(); //page two of songkick

  // consolidate tickets
  tickets_philips_backyarder.forEach(function (obj: any) {
    tickets_victoria.push(obj);
  });
  tickets_vic_spotify.forEach(function (obj: any) {
    tickets_victoria.push(obj);
  });
  tickets_vic_songkick_1.forEach(function (obj: any) {
    tickets_victoria.push(obj);
  });
  tickets_vic_songkick_2.forEach(function (obj: any) {
    tickets_victoria.push(obj);
  });

  // sort by date
  if (tickets_victoria) tickets_victoria.sort(sortByDate);

  // remove duplicates
  tickets_victoria = removeDuplicateBands(tickets_victoria);

  // create simple data collection
  addSimpleDataToCollection(('db_victoria' + '_' + date).toString(), tickets_victoria, db_connect);
}

export async function extractTicketsVancouver() {
  let date = getTodaysDate();
  let db_connect = dbo.getDb();

  // extract from record shop website
  let tickets_vancouver: any[] = [];
  //let tickets_redcat = await extract_vancouver();
  let tickets_van_songkick_1 = await extract_van_songkick_1(); //page one of songkick
  let tickets_van_songkick_2 = await extract_van_songkick_2(); //page two of songkick

  console.log('tickets_van_songkick_1', tickets_van_songkick_1);
  console.log('tickets_van_songkick_2', tickets_van_songkick_2);

  // consolidate tickets
  // tickets_redcat.forEach(function (obj: any) {
  //   tickets_vancouver.push(obj);
  // });
  tickets_van_songkick_1.forEach(function (obj: any) {
    tickets_vancouver.push(obj);
  });
  tickets_van_songkick_2.forEach(function (obj: any) {
    tickets_vancouver.push(obj);
  });

  // sort by date
  if (tickets_vancouver) tickets_vancouver.sort(sortByDate);

  // remove duplicates
  tickets_vancouver = removeDuplicateBands(tickets_vancouver);

  const collection_name = ('db_vancouver' + '_' + date).toString();

  await db_connect.createCollection(collection_name, function (err: any, res: any) {
    //if (err) throw err;
    console.log(collection_name + ' created!');
  });

  await db_connect
    .collection(collection_name)
    .insertMany(tickets_vancouver, function (err: any, res: { insertedCount: string }) {
      if (err) throw err;
      console.log('Successfully added ' + res.insertedCount + ' records to ' + collection_name);
    });

  //console.log('Starting to add Spotify data ...');
  //await updateCollectionWithSpotify(collection_name, db_connect);

  //manualRun(collection_name);

  // create simple data collection
  //addSimpleDataToCollection(('db_vancouver' + '_' + date).toString(), tickets_vancouver, db_connect);
}

function sortByDate(a: any, b: any) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function removeDuplicateBands(arr: any) {
  var cleaned: any[] = [];
  arr.forEach(function (itm: any) {
    var unique = true;
    cleaned.forEach(function (itm2) {
      if (_.isEqual(itm.ticket_band, itm2.ticket_band)) unique = false;
    });
    if (unique) cleaned.push(itm);
  });
  return cleaned;
}

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return mm + '-' + dd + '-' + yyyy;
}
