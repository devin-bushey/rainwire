require('dotenv').config({ path: './config.env' });
import dbo from './db/conn';
import _ from 'lodash';

import { addSimpleDataToCollection } from './db/addSimpleDataToCollection';
import { Cities, Festivals } from './enums/common';

import { extract_osheaga } from './scripts/extract_osheaga';
import { extract_songkick } from './scripts/extract_songkick';
import { extract_phillips_backyarder } from './scripts/extract_philips_backyarder';
import { Artist } from './types/Artists';
import { extract_laketown_shakedown } from './scripts/extract_laketown_shakedown';
import { extract_capital_ballroom } from './scripts/extract_capital_ballroom';
import { extract_function_festival } from './scripts/extract_function_festival';
import { extract_coachella } from './scripts/extract_coachella';

export const extract = async (location: Cities | Festivals) => {
  const db_connect = dbo.getDb();

  const collectionName = location + '_simple';
  let tickets: Artist[];

  switch (location) {
    case Cities.Victoria:
      tickets = await extractVictoria();
      break;

    case Cities.Vancouver:
      tickets = await extractVancouver();
      break;

    case Festivals.PhilipsBackyard:
      tickets = await extractPhillipsBackyard();
      break;

    case Festivals.Osheaga:
      tickets = await extractOsheaga();
      break;

    case Festivals.LaketownShakedown:
      tickets = await extractLaketownShakedown();
      break;

    case Festivals.TheFunction:
      tickets = await extractFunctionFestival();
      break;

    case Festivals.Coachella:
      tickets = await extractCoachella();
      break;

    default:
      tickets = [];
      break;
  }

  return await addSimpleDataToCollection(collectionName, tickets, db_connect);
};

const extractVictoria = async () => {
  let tickets: Artist[] = [];

  const tickets_vic_songkick_1 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27399-canada-victoria?page=1#metro-area-calendar',
  ); //page one of songkick
  const tickets_vic_songkick_2 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27399-canada-victoria?page=2#metro-area-calendar',
  ); //page two of songkick
  const tickets_vic_songkick_3 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27399-canada-victoria?page=3#metro-area-calendar',
  ); //page three of songkick

  tickets_vic_songkick_1.forEach(function (obj: Artist) {
    tickets.push(obj);
  });
  tickets_vic_songkick_2.forEach(function (obj: Artist) {
    tickets.push(obj);
  });
  tickets_vic_songkick_3.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  const tickets_capital = await extract_capital_ballroom();

  tickets_capital.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};

const extractVancouver = async () => {
  let tickets: Artist[] = [];

  const tickets_van_songkick_1 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27398-canada-vancouver?page=1#metro-area-calendar',
  ); //page one of songkick
  const tickets_van_songkick_2 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27398-canada-vancouver?page=2#metro-area-calendar',
  ); //page two of songkick
  const tickets_van_songkick_3 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27398-canada-vancouver?page=3#metro-area-calendar',
  ); //page three of songkick

  // consolidate tickets
  tickets_van_songkick_1.forEach(function (obj: Artist) {
    tickets.push(obj);
  });
  tickets_van_songkick_2.forEach(function (obj: Artist) {
    tickets.push(obj);
  });
  tickets_van_songkick_3.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};

const extractOsheaga = async () => {
  let tickets: Artist[] = [];

  const tickets_osheaga = await extract_osheaga();

  tickets_osheaga.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};

const extractPhillipsBackyard = async () => {
  let tickets: Artist[] = [];

  const tickets_phillips_backyarder = await extract_phillips_backyarder();

  tickets_phillips_backyarder.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};

const extractLaketownShakedown = async () => {
  let tickets: Artist[] = [];

  const tickets_laketownShakedown = await extract_laketown_shakedown();

  tickets_laketownShakedown.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};

const extractFunctionFestival = async () => {
  let tickets: Artist[] = [];

  const extracted = await extract_function_festival();

  extracted.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};

const extractCoachella = async () => {
  let tickets: Artist[] = [];

  const extracted = await extract_coachella();

  extracted.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};
