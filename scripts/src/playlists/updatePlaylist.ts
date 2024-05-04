require("dotenv").config({ path: "../.env" });

import axios from "axios";
import { Collection, MongoClient } from "mongodb";
import { Gig } from "../model/Gig";
import { getSpotifyAccessToken } from "../services/spotifyAuth";

// USAGE:
// npx ts-node ./src/playlists/updatePlaylist.ts <city>

/**
 * EXAMPLE USAGE:
 * 
 * NOTE: To test, create a new spotify playlist on the spotify app and name it "test"
 * 
 * curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "token": "BQBTN4ulFxi9haBiYgfUtyHGejG4Nx3xDN_nlGLJkmwmzow_4FZH2S6ljDmQrSQHs16hPzegBwhyrFWRUvlf6yeWurMr8XuN2qneHtdPJs-HrdqqjXQbyx94B4eeBmLmqdgcQs2zYSAvulf1gNWzBfGuCyla83J8acb-R3Bsb3oOjSueRFNfGhpLZmSN7jd8lWB5JMJ16V7mONgKuUFs8AT8H2m_615C4XRhvg",
    "userId": "n54pdoqawgph9ftwztxe6k77a",
    "playlistName": "test",
    "collectionName": "victoria"
  }' \
  http://localhost:5000/playlist/update
  
 */

const ATLAS_URI = process.env.ATLAS_URI || "";
const SP_RECORDSHOP_USER_ID = process.env.SP_RECORDSHOP_USER_ID || "";
const BACKEND_URI = process.env.VITE_SITE_URL_DB || "";

const CITY = process.argv[2];

const getGigsForCity = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(ATLAS_URI);
    await client.connect();
    console.log("Successfully connected to MongoDB");

    const db = client.db("RecordShop");
    const collection: Collection<Gig> = db.collection(CITY);
    const today = new Date();
    const gigs: Gig[] = await collection.find({ date: { $gte: today } }).toArray();

    await client.close();

    return gigs;
  } catch (error) {
    console.error("Failed to update MongoDB:", error);
  }
};

const spotify = async (spotifyAccessToken: string) => {
  const options = {
    method: "PUT",
    url: `${BACKEND_URI}playlist/update`,
    data: {
      // token: spotifyAccessToken,
      token:
        "BQCDE3b0BrI9SjlGi5oe9osFPeoEfqm01n9pxmmRzxREGjshx1om79JU-s4ZmcT5kNBl-y4weNTiDChj2BPLy82RCkewAiHp5kcRWbsXGX6cpOge5BrpIbGz5TDx95FkZFi4YAOxluJGuB2l6ExJui04tNeNRYSQvNA3ispRxtLCR-9OZJdLmjagyIYD7LUksG5jRpvO-iP7sU_oimxsDrgjmZNhYuzc0aoVUw",
      userId: SP_RECORDSHOP_USER_ID,
      playlistName: "test",
      collectionName: "victoria_2024",
    },
    headers: { Accept: "application/json" },
  };

  const response = await axios(options);
  console.log(response);
};

const updatePlaylist = async () => {
  try {
    const gigs = await getGigsForCity();
    const spotifyAccessToken = await getSpotifyAccessToken();
    spotify(spotifyAccessToken);
  } catch (error) {
    console.error("Whoops, something went wrong :(", error);
  }
};

updatePlaylist();
