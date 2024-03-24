import express from "express";
import dbo from "../database/conn";
import {
  addPlaylistItems,
  getPlaylistId,
  getPlaylistItems,
  removePlaylistItems,
} from "../helpers/spotifyPlaylistHelpers";
import { filterRecent } from "../helpers/filterRecent";

export const playlistRouter = express.Router();

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

/**
 * Currently, this endpoint will update a users playlist by deleting the existing tracks
 * then adding tracks from the recordshop database.
 *
 * Its really just a way to test the helper methods.
 *
 * Lets do something cool with this.
 *
 */
playlistRouter.route("/playlist/update").put(async (req, response) => {
  const { token, userId, playlistName, collectionName } = req.body;

  try {
    const playlistId = await getPlaylistId({
      token: token,
      user_id: userId,
      playlistName: playlistName,
    });

    const artistsFromDatabase = await getArtistsFromDatabase(collectionName);
    const sortedArtists = filterRecent(artistsFromDatabase);

    let tracksFromDatabase = [];
    for (const artist of sortedArtists) {
      if (artist.topTrackURIs && artist.topTrackURIs[0]) {
        tracksFromDatabase.push(artist.topTrackURIs[0]);
      }
    }

    const tracksFromUsersPlaylist = await getPlaylistItems({ token: token, playlistId: playlistId });
    await removePlaylistItems({ token: token, playlistId: playlistId, tracks: tracksFromUsersPlaylist });
    await addPlaylistItems({ token: token, playlistId: playlistId, tracks: tracksFromDatabase });

    response
      .status(200)
      .json(`Yassss! Successfully updated the playlist: ${playlistName} with ${tracksFromDatabase.length} tracks.`);
  } catch (err) {
    response.status(400).json(`Whoops! Something went wrong :(`);
  }
});

// TODO: this is probably a common function?
const getArtistsFromDatabase = async (collectionName: string) => {
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

  return await db_connect.collection(collectionName).find({}).toArray();
};
