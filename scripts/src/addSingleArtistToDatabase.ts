require("dotenv").config({ path: "../.env" });
import { MongoClient } from "mongodb";
import axios from "axios";

// USAGE: npx ts-node ./src/addSingleArtistToDatabase.ts <Spotify Artist Id> <Date> <Popularity> <Venue> <DB Collection>

// EXAMPLE: npx ts-node ./src/addSingleArtistToDatabase.ts 22Wn2cTdoUftbKvBxaGAyR "2024/08/11" 13100 "Phillips Backyard" "phillipsBackyard_2024"

// # Get the spotify Id from opening up spotify in your browser (easiest to click an artist from record shop)
// # then search for an artist, then the Id is last in the url (Example: https://open.spotify.com/artist/79JJCxCCfJ8HufX6w8q2k4)

const artistId = process.argv[2];
const date = process.argv[3];
const popularity = process.argv[4];
const venue = process.argv[5];
const collectionName = process.argv[6];

const ATLAS_URI = process.env.ATLAS_URI || "";
const SP_REFRESH_TOKEN = process.env.SP_REFRESH_TOKEN;
const SP_CLIENT_ID = process.env.SP_CLIENT_ID;
const SP_CLIENT_S = process.env.SP_CLIENT_S;

const getSpotifyAccessToken = async () => {
  const optionsSpotifyAccessToken = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(SP_CLIENT_ID + ":" + SP_CLIENT_S).toString("base64")}`,
    },
    params: {
      grant_type: "refresh_token",
      refresh_token: SP_REFRESH_TOKEN,
      client_id: SP_CLIENT_ID,
    },
  };

  console.log("Getting Spotify token...");
  const response = await axios(optionsSpotifyAccessToken);
  console.log("Yew!! Successfully retrieved the token");
  return response.data.access_token;
};

const addToMongoDb = async (_concertObject: any) => {
  // Connect to MongoDB and save the concertObject to the specified collection
  const client = new MongoClient(ATLAS_URI);
  try {
    await client.connect();
    console.log("Succesfully connected");
  } catch (e) {
    console.error(e);
  }
  const db = client.db("RecordShop");

  try {
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(_concertObject);
    console.log(`${_concertObject.artist.name} was inserted with the _id: ${result.insertedId} into ${collectionName}`);
  } catch (e) {
    console.log("addToMongoDb error");
    console.error(e);
  } finally {
    // Close the MongoDB client connection
    await client.close();
    process.exit(2);
  }
};

const addSingleArtist = async () => {
  const bearerToken = await getSpotifyAccessToken();

  // Make a GET request to Spotify API to get top tracks
  const options = {
    method: "GET",
    url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ca`,
    headers: {
      Authorization: "Bearer " + bearerToken,
    },
  };

  const concertObject: any = {
    artist: {
      id: artistId,
      name: "",
      topTracks: [],
      uri: `spotify:artist:${artistId}`,
      albumArtUrl: "",
      link: `https://open.spotify.com/artist/${artistId}`,
    },
    date: new Date(date),
    venue,
    popularity,
  };

  try {
    const response = await axios(options);
    const topTracks = response.data.tracks;
    topTracks.forEach((track: any) => {
      concertObject.artist.topTracks.push(track.uri); // NEW
    });

    const name = topTracks[0].album.artists[0].name;
    concertObject.artist.name = name; // NEW

    const albumArt = topTracks[0].album.images[1].url;
    concertObject.artist.albumArtUrl = albumArt; // NEW

    await addToMongoDb(concertObject);

    // Print the concert object as JSON
    console.log(JSON.stringify(concertObject, null, 2));
  } catch (err: any) {
    console.log("topTracks error");
    console.log(err);
  }
};

addSingleArtist();
