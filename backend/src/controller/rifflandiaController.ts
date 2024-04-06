import express from "express";
import dbo from "../database/conn";
import { CreateNewPlaylistRifflandia } from "../helpers/rifflandia/createPlaylist";
import { cachedGigs } from "../cache/gigsCache";
import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";
import { Gig } from "../types/Gig";

export const rifflandiaRouter = express.Router();
const RIFFLANDIA = "rifflandia";

rifflandiaRouter.route("/rifflandia").get(async (req, response) => {
  // Check if data is cached in memory
  if (cachedGigs.cachedRifflandiaGigs) {
    // If data is found in cache, return the cached data
    response.json(cachedGigs.cachedRifflandiaGigs);
  } else {
    console.log("cache not found for /rifflandia: ", cachedGigs.cachedRifflandiaGigs);

    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(RIFFLANDIA);
    const gigs: Gig[] = await collection.find({}).toArray();

    // Save the fetched data to cache
    cachedGigs.cachedRifflandiaGigs = gigs;
    response.json(gigs);
  }
});

rifflandiaRouter.route("/rifflandia-create").post(async (req, response) => {
  const { token, user_id, numTopTracks, days } = req.body;

  let dayQuery;
  let sortBy;

  if (!days || days.length === 0) {
    sortBy = "orderNum";
    dayQuery = {};
  } else {
    sortBy = "day";
    dayQuery = {
      day: {
        $in: days,
      },
    };
  }

  const db_connect = await connectToDatabase();
  const collection: Collection<Gig> = db_connect.collection(RIFFLANDIA);
  const gigs: Gig[] = await collection.find(dayQuery).toArray();

  const url = await CreateNewPlaylistRifflandia({
    token: token,
    user_id: user_id,
    numTopTracks: numTopTracks,
    artists: gigs,
    sortBy: sortBy,
    days: days,
  }).catch((error) => {
    console.log(error);
    response.status(500).json({ error: error.message });
  });

  if (url) {
    response.status(201).json(url);
  } else {
    response.status(500).json({ error: "Something went wrong" });
  }
});
