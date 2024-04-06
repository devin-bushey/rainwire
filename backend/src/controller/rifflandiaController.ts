import express from "express";
import dbo from "../database/conn";
import { CreateNewPlaylistRifflandia } from "../helpers/rifflandia/createPlaylist";
import { cachedGigs } from "../cache/gigsCache";

export const rifflandiaRouter = express.Router();

rifflandiaRouter.route("/rifflandia").get(async (req, response) => {
  // Check if data is cached in memory
  if (cachedGigs.cachedRifflandiaGigs) {
    // If data is found in cache, return the cached data
    response.json(cachedGigs.cachedRifflandiaGigs);
  } else {
    console.log("cache not found for /rifflandia: ", cachedGigs.cachedRifflandiaGigs);

    let db_connect = dbo.getDb();

    if (!db_connect) {
      console.log("reconnecting to db");
      await dbo.connectToServer(function (err: any) {
        if (err) {
          console.log("reconnecting error");
          console.error(err);
        }
      });
      db_connect = dbo.getDb();
    }

    db_connect
      .collection(`rifflandia`)
      .find({})
      .toArray()
      .then((data: any) => {
        // Save the fetched data to cache
        cachedGigs.cachedRifflandiaGigs = data;
        response.json(data);
      });
  }
});

rifflandiaRouter.route("/rifflandia-create").post(async (req, response) => {
  const { token, user_id, numTopTracks, days } = req.body;

  let db_connect = dbo.getDb();

  if (!db_connect) {
    console.log("reconnecting to db");
    await dbo.connectToServer(function (err: any) {
      if (err) {
        console.log("reconnecting error");
        console.error(err);
      }
    });
    db_connect = dbo.getDb();
  }

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

  const artists = await db_connect.collection("rifflandia").find(dayQuery).toArray();

  const url = await CreateNewPlaylistRifflandia({
    token: token,
    user_id: user_id,
    numTopTracks: numTopTracks,
    artists: artists,
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
