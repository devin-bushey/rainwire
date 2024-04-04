import express, { Request, Response } from "express";
export const victoriaRouter = express.Router();

import { createNewPlaylist } from "../helpers/createPlaylist";
import { Cities } from "../enums/Cities";
import { cachedData } from "../cache/cachedGigs";
import { Gig } from "../types/Gig";
import { connectToDatabase } from "../database/connectToDatabase";
import { Collection } from "mongodb";

victoriaRouter.route("/artists").get(async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(`${city}`);

    if (city === Cities.Victoria_2024 && cachedData.cachedVictoria) {
      res.json(cachedData.cachedVictoria);
      return;
    }

    const data: Gig[] = await collection.find({}).toArray();

    if (city === Cities.Victoria_2024) {
      cachedData.cachedVictoria = data;
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

victoriaRouter.route("/create").post(async (req: Request, res: Response) => {
  try {
    const { token, city, user_id, numTopTracks, days } = req.body;

    const db_connect = await connectToDatabase();
    const collection: Collection<Gig> = db_connect.collection(city);
    const gigs: Gig[] = await collection.find({}).toArray();

    const url = await createNewPlaylist({
      token,
      city,
      user_id,
      numTopTracks,
      gigs,
    });

    res.status(201).json(url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
