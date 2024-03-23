require("dotenv").config({ path: "./config.env" });
import dbo from "../../database/conn";
import _ from "lodash";

import { addSimpleDataToCollection } from "../../database/addSimpleDataToCollection";

import { extract_songkick } from "./sources/extract_songkick";
import { extract_capital_ballroom } from "./sources/extract_capital_ballroom";

import { Cities } from "../../enums/Cities";
import { Festivals } from "../../enums/Festivals";
import { extract_phillips_backyarder } from "./sources/extract_philips_backyarder";
import { Artist } from "../../types/Artists";

export const extract = async (location: Cities | Festivals) => {
  const db_connect = dbo.getDb();

  const collectionName = location + "_simple";
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

    default:
      tickets = [];
      break;
  }

  return await addSimpleDataToCollection(collectionName, tickets, db_connect);
};

const extractVictoria = async () => {
  let tickets: Artist[] = [];

  const tickets_vic_songkick_1 = await extract_songkick(
    "https://www.songkick.com/metro-areas/27399-canada-victoria?page=1#metro-area-calendar",
  ); //page one of songkick
  const tickets_vic_songkick_2 = await extract_songkick(
    "https://www.songkick.com/metro-areas/27399-canada-victoria?page=2#metro-area-calendar",
  ); //page two of songkick
  const tickets_vic_songkick_3 = await extract_songkick(
    "https://www.songkick.com/metro-areas/27399-canada-victoria?page=3#metro-area-calendar",
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
    "https://www.songkick.com/metro-areas/27398-canada-vancouver?page=1#metro-area-calendar",
  ); //page one of songkick
  const tickets_van_songkick_2 = await extract_songkick(
    "https://www.songkick.com/metro-areas/27398-canada-vancouver?page=2#metro-area-calendar",
  ); //page two of songkick
  const tickets_van_songkick_3 = await extract_songkick(
    "https://www.songkick.com/metro-areas/27398-canada-vancouver?page=3#metro-area-calendar",
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

const extractPhillipsBackyard = async () => {
  let tickets: Artist[] = [];

  const tickets_phillips_backyarder = await extract_phillips_backyarder();

  tickets_phillips_backyarder.forEach(function (obj: Artist) {
    tickets.push(obj);
  });

  return tickets;
};
