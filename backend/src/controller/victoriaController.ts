import express from "express";
export const victoriaRouter = express.Router();
import dbo from "../database/conn";

import { CreateNewPlaylist } from "../helpers/createPlaylist";

import { Cities } from "../enums/Cities";
import { cachedGigs } from "../cache/gigsCache";
import { Gig } from "../types/Gig";
import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";

victoriaRouter.route("/artists").get(async (req, response) => {
  const { city } = req.query;

  if (city === Cities.Victoria_2024 && cachedGigs.cachedGigsVictoria) {
    response.json(cachedGigs.cachedGigsVictoria);
  } else {
    if (city === Cities.Victoria_2024) console.log("cache not found for /victoria: ", cachedGigs.cachedGigsVictoria);

    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(`${city}`);
    const gigs: Gig[] = await collection.find({}).toArray();

    // Save the fetched data to cache
    if (city === Cities.Victoria_2024) {
      cachedGigs.cachedGigsVictoria = gigs;
    }
    response.json(gigs);
  }
});

victoriaRouter.route("/create").post(async (req, response) => {
  const { token, city, user_id, numTopTracks, days } = req.body;

  let dayQuery;
  let sortBy;

  if (!days || days.length === 0) {
    // TODO: can change to 'popularity'
    sortBy = "date";
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
  const collection: Collection<Gig> = db_connect.collection(`${city}`);
  const gigs: Gig[] = await collection.find(dayQuery).toArray();

  const url = await CreateNewPlaylist({
    token: token,
    city: city,
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
