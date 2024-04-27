import express from "express";
export const victoriaRouter = express.Router();

import { CreateNewPlaylist } from "../helpers/createPlaylist";
import { Gig } from "../types/Gig";
import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";

victoriaRouter.route("/artists").get(async (req, response) => {
  const { city } = req.query;

  const db_connect = await connectToDatabase();
  const collection: Collection<Gig> = db_connect.collection(`${city}`);
  const gigs: Gig[] = await collection.find({}).toArray();

  response.json(gigs);
});

victoriaRouter.route("/create").post(async (req, response) => {
  const { token, city, user_id, numTopTracks, sortBy, overrideGigs } = req.body;

  let gigs: Gig[] = [];
  if (overrideGigs) {
    gigs = overrideGigs;
  } else {
    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(`${city}`);
    gigs = await collection.find({}).toArray();
  }

  const url = await CreateNewPlaylist({
    token,
    city,
    user_id,
    numTopTracks,
    gigs,
    sortBy,
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
