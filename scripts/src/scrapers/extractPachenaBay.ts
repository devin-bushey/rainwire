import { buildArtist } from "../model/Artist";
import { UnsavedGig, buildGig } from "../model/Gig";

const cheerio = require("cheerio");
const axios = require("axios");
const { MongoClient } = require("mongodb");

/**
 * USAGE:
 *
 * npx ts-node extractPachenaBay.ts
 */

const DATABASE_URL = "mongodb://root:example@localhost:27017/";
const DATABASE_COLLECTION_NAME = "pachena_bay_simple";

const PACHENA_BAY_ARTISTS_URL = "https://www.pachenabaymusicfestival.com/artists";

const PACHENA_BAY_VENUE = "Pachena Bay";
const PACHENA_BAY_DATE = new Date("07-19-2024");

const runScrape = async () => {
  console.log(`Starting Web Scraping for Pachena Bay: ${PACHENA_BAY_ARTISTS_URL}`);
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log("Succesfully connected to ", DATABASE_URL);
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }

  const db = client.db("RecordShop");

  try {
    await scrapePachenaArtistsPage(db);
  } catch (err: any) {
    console.log("Error /extract: ", err);
    process.exit(-2);
  }

  process.exit(2);
};

const scrapePachenaArtistsPage = async (db: any) => {
  const artists = await extractArtists();

  if (artists.length > 0) console.log(artists.length, " Tickets extracted!");

  console.log("Creating collection .... ");

  try {
    await db.createCollection(DATABASE_COLLECTION_NAME);
    console.log(DATABASE_COLLECTION_NAME + " created!");
  } catch (err) {
    console.log("\n**** Error creating DB collection: ", err);
    process.exit(-4);
  }

  try {
    await db.collection(DATABASE_COLLECTION_NAME).insertMany(artists);
    console.log("Successfully added records to " + DATABASE_COLLECTION_NAME);
  } catch (err) {
    console.log("\n**** Error adding records to DB: ", err);
  }
};

const extractArtists = async () => {
  console.log(`Extracting artists from ${PACHENA_BAY_ARTISTS_URL}`);

  return await axios
    .get(PACHENA_BAY_ARTISTS_URL)
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      let data: UnsavedGig[] = [];

      $("div[role=listitem]").each(function (index: any, element: any) {
        var artistName = $(element).find("h2 > span.wixui-rich-text__text").text().trim();

        if (artistName) {
          console.log(`Found artist: ${artistName}`);

          data.push(
            buildGig({
              artist: buildArtist({ name: artistName }),
              venue: PACHENA_BAY_VENUE,
              date: PACHENA_BAY_DATE,
              popularity: index,
            }),
          );
        }
      });

      return data;
    })
    .catch((err: any) => {
      console.log("\n**** Error extracting Pachena artists", err);
      return [];
    });
};

runScrape();
