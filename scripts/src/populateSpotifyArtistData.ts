// require("dotenv").config({ path: "../config.env" });
// import { get } from "../http/request";
// import _ from "lodash";
import { findBestMatch } from "string-similarity";
import { MongoClient } from "mongodb";
import { buildArtist } from "./model/Artist";
import { Gig } from "./model/Gig";
const axios = require("axios");

if (process.argv.length !== 4) {
  console.error("Usage: npx ts-node populateSpotifyArtistData.ts <COLLECTION_NAME> <SPOTIFY_TOKEN>");
  process.exit(-1);
}

const DATABASE_URL = "mongodb://root:example@localhost:27017/";
const COLLECTION_NAME = process.argv[2];
const SPOTIFY_TOKEN = process.argv[3];

/**
 * USAGE
 *
 * npmx ts-node populateSpotifyArtistData.ts COLLECTION_NAME SPOTIFY_TOKEN
 */

export const updateCollectionWithSpotify = async () => {
  const dbConnection = await connectToDatabase();

  if (!dbConnection) throw new Error("Error connecting to DB");

  dbConnection
    .collection(COLLECTION_NAME + "_simple")
    .find({})
    .toArray(async (err, result) => {
      if (err) throw err;

      const populatedGigs = await addSpotifyData(result as any);
      await createNewCollection(dbConnection, populatedGigs);
    });
};

const connectToDatabase = async () => {
  // Connect to MongoDB and update the existing collection
  const client = new MongoClient(DATABASE_URL);
  try {
    console.log(`Connecting to your database ..`);
    await client.connect();
    console.log("Successfully connected to ", DATABASE_URL);
  } catch (e) {
    console.error(e);
    return;
  }

  return client.db("RecordShop");
};

async function addSpotifyData(dbGigs: Gig[]) {
  const populatedGigs: Gig[] = [];

  for (let gig of dbGigs) {
    let populatedGig = await addSpotifyMainData(gig);
    populatedGig = await addSpotifyTopTracks(gig);
    if (populatedGig) populatedGigs.push(gig);
  }

  return populatedGigs;
}

const addSpotifyMainData = async (gig: Gig): Promise<Gig | undefined> => {
  const artistName = gig.artist.name;
  console.log(`Searching spotify for ${artistName}`);

  return axios({
    url: "https://api.spotify.com/v1/search",
    headers: {
      Authorization: "Bearer " + SPOTIFY_TOKEN,
    },
    params: {
      q: artistName,
      type: "artist",
    },
  })
    .then(async function (res: any) {
      const bestMatch = findMatchingSpotifyArtist(
        res.data.artists.items,
        artistName,
        res.data.artists.items.map((artist: any) => artist.name),
      );

      if (bestMatch) {
        gig.artist = buildArtist({
          id: bestMatch.id,
          name: bestMatch.name,
          link: bestMatch.external_urls.spotify,
          uri: bestMatch.uri,
        });
        return gig;
      } else {
        console.log(`No good Spotify artist matches for artist "${artistName}"; skipping.`);
        return undefined;
      }
    })

    .catch(function (error: any) {
      console.log(`Error adding Spotify artist data for artist ${artistName}.`, error);
      return undefined;
    });
};

const findMatchingSpotifyArtist = (artists: any, query: string, options: any) => {
  const matches = findBestMatch(
    query.toLowerCase(),
    options.map((option: any) => option.toLowerCase()),
  );

  if (matches.bestMatch.rating >= 0.95) {
    return artists[matches.bestMatchIndex];
  }

  return undefined;
};

const addSpotifyTopTracks = async (gig: Gig): Promise<Gig | undefined> => {
  const { id, name } = gig.artist;

  if (!id) {
    console.log(`Cannot look up Spotify tracks for unknown artist "${name}"`);
    return undefined;
  }

  return axios({
    url: "https://api.spotify.com/v1/artists/" + id + "/top-tracks?market=CA",
    headers: {
      Authorization: "Bearer " + SPOTIFY_TOKEN,
    },
  })
    .then((res: any) => {
      gig.artist.albumArtUrl = res.data.tracks[0].album.images[1].url;
      gig.artist.topTracks = res.data.tracks.map((track: any) => track.uri);
      return gig;
    })
    .catch((error: any) => {
      console.log(`Error fetching Spotify tracks for artist "${name}"`, error);
      return undefined;
    });
};

const createNewCollection = async (dbConnection: any, gigs: Gig[]) => {
  await dbConnection.createCollection(COLLECTION_NAME, (err: any, result: any) => {
    console.log(COLLECTION_NAME + " created!");
  });

  await dbConnection.collection(COLLECTION_NAME).insertMany(gigs, (err: any, res: any) => {
    console.log("Successfully added " + res.insertedCount + " records to " + COLLECTION_NAME);
  });
};

try {
  updateCollectionWithSpotify();
} catch (err) {
  console.log(err);
  process.exit(1);
}
