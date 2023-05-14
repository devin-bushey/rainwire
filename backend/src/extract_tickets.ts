require('dotenv').config({ path: './config.env' });
import dbo from './db/conn';
import _ from 'lodash';

import { extract_vic_songkick_1 } from './extraction_scripts/extract_vic_songkick';
import { extract_vic_songkick_2 } from './extraction_scripts/extract_vic_songkick_page2';

import { addSimpleDataToCollection } from './db/addSimpleDataToCollection';
import { extract_capital_ballroom } from './extraction_scripts/extract_capital_ballroom';
import { extract_philips_backyarder } from './extraction_scripts/extract_philips_backyarder';
import { extract_van_songkick_1 } from './extraction_scripts/extract_van_songkick';
import { extract_van_songkick_2 } from './extraction_scripts/extract_van_songkick_page2';
import { Cities, Festivals } from './enums/common';
import { extract_victoria } from './extraction_scripts/extract_victoria';
import { extract_laketown_shakedown } from './extraction_scripts/extract_laketown_shakedown';
import { extract_osheaga } from './extraction_scripts/extract_oshaega';
import { extract_coachella } from './extraction_scripts/extract_coachella';

export const extract = async (location: Cities | Festivals) => {
  const date = getTodaysDate();
  const db_connect = dbo.getDb();

  const collectionName = 'db_' + location + '_' + date;
  let tickets: any[] = [];

  if (location === Cities.Victoria) {
    const tickets_vic_music_scene = await extract_victoria('http://victoriamusicscene.com/concerts/list/');
    const tickets_vic_music_scene_2 = await extract_victoria('http://victoriamusicscene.com/concerts/list/page/2/');
    const tickets_vic_music_scene_3 = await extract_victoria('http://victoriamusicscene.com/concerts/list/page/3/');

    const tickets_vic_spotify = await extract_capital_ballroom();
    const tickets_vic_songkick_1 = await extract_vic_songkick_1(); //page one of songkick
    const tickets_vic_songkick_2 = await extract_vic_songkick_2(); //page two of songkick

    // consolidate tickets
    tickets_vic_music_scene.forEach(function (obj: any) {
      tickets.push(obj);
    });
    tickets_vic_music_scene_2.forEach(function (obj: any) {
      tickets.push(obj);
    });
    tickets_vic_music_scene_3.forEach(function (obj: any) {
      tickets.push(obj);
    });

    tickets_vic_spotify.forEach(function (obj: any) {
      tickets.push(obj);
    });
    tickets_vic_songkick_1.forEach(function (obj: any) {
      tickets.push(obj);
    });
    tickets_vic_songkick_2.forEach(function (obj: any) {
      tickets.push(obj);
    });
  } else if (location === Cities.Vancouver) {
    const tickets_van_songkick_1 = await extract_van_songkick_1(); //page one of songkick
    const tickets_van_songkick_2 = await extract_van_songkick_2(); //page two of songkick

    // consolidate tickets
    tickets_van_songkick_1.forEach(function (obj: any) {
      tickets.push(obj);
    });
    tickets_van_songkick_2.forEach(function (obj: any) {
      tickets.push(obj);
    });
  } else if (location === Festivals.PhilipsBackyard) {
    const tickets_philips_backyarder = await extract_philips_backyarder();

    tickets_philips_backyarder.forEach(function (obj: any) {
      tickets.push(obj);
    });
  } else if (location === Festivals.LaketownShakedown) {
    const tickets_laketown = await extract_laketown_shakedown();

    tickets_laketown.forEach(function (obj: any) {
      tickets.push(obj);
    });
  } else if (location === Festivals.Osheaga) {
    const tickets_osheaga = await extract_osheaga();

    tickets_osheaga.forEach(function (obj: any) {
      tickets.push(obj);
    });
  } else if (location === Festivals.Coachella) {
    const tickets_coachella = await extract_coachella();

    tickets_coachella.forEach(function (obj: any) {
      tickets.push(obj);
    });
  }

  // sort by date
  if (tickets) tickets.sort(sortByDate);

  // remove duplicates
  tickets = removeDuplicateBands(tickets);

  // create simple data collection, does not included spotify data
  return await addSimpleDataToCollection(collectionName, tickets, db_connect);
};

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
