require('dotenv').config({ path: './config.env' });
import dbo from './db/conn';
import _ from 'lodash';

import { extract_vic_songkick_1 } from './extraction_scripts/extract_vic_songkick';
import { extract_vic_songkick_2 } from './extraction_scripts/extract_vic_songkick_page2';

import { addSimpleDataToCollection } from './db/addSimpleDataToCollection';
import { extract_capital_ballroom } from './extraction_scripts/extract_capital_ballroom';
import { extract_philips_backyarder } from './extraction_scripts/extract_philips_backyarder';

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
