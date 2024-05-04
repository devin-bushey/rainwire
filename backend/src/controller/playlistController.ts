import express from "express";
import {
  addPlaylistItems,
  getPlaylist,
  getPlaylistItems,
  removePlaylistItems,
} from "../helpers/spotifyPlaylistHelpers";
import { Collection } from "mongodb";
import { connectToDatabase } from "../database/connectToDatabase";
import { Gig } from "../types/Gig";

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
    const playlist = await getPlaylist({
      token: token,
      user_id: userId,
      playlistName: playlistName,
    });

    if (!playlist) {
      response.status(404).json(`Whoops! Playlist not found :(`);
      return;
    }

    // remove all existing tracks from playlist
    const tracksFromUsersPlaylist = await getPlaylistItems({ token: token, playlistId: playlist.id });
    await removePlaylistItems({ token: token, playlistId: playlist.id, tracks: tracksFromUsersPlaylist });

    // add all future gig tracks to playlist
    const gigsFromDatabase = await getAllFutureGigsFromCollection(collectionName);
    const addedTracksCount = await addPlaylistItems({
      token: token,
      playlistId: playlist.id,
      tracks: gigsFromDatabase,
    });

    response
      .status(200)
      .json(`Yassss! Successfully updated the playlist: ${playlistName} with ${addedTracksCount} tracks.`);
  } catch (err) {
    response.status(400).json(`Whoops! Something went wrong :(`);
  }
});

playlistRouter.route("/playlist").get(async (req, response) => {
  const { token, userId, playlistName } = req.query;

  try {
    const playlist = await getPlaylist({
      token: token,
      user_id: userId,
      playlistName: playlistName,
    });

    if (!playlist?.id) {
      response.status(404).json(`Whoops! Playlist not found :(`);
      return;
    }

    const tracksFromUsersPlaylist = await getPlaylistItems({ token: token, playlistId: playlist.id });

    const playlistObj = {
      id: playlist.id,
      name: playlist.name,
      image: playlist.image,
      uri: playlist.uri,
      tracks: tracksFromUsersPlaylist,
    };

    response.status(200).json(playlistObj);
  } catch (err) {
    response.status(400).json(`Whoops! Something went wrong :(`);
  }
});

playlistRouter.route("/playlist/track").post(async (req, response) => {
  const { token, playlistId, trackId } = req.body;
  try {
    await addPlaylistItems({ token: token, playlistId: playlistId, tracks: [trackId] });
    response.status(200).json(`Yay, added ${trackId} to ${playlistId}`);
  } catch (err) {
    response.status(400).json(`Whoops! Something went wrong :(`);
  }
});

// TODO: this is probably a common function?
const getAllFutureGigsFromCollection = async (collectionName: string): Promise<Gig[]> => {
  const db_connect = await connectToDatabase();
  const collection: Collection<Gig> = db_connect.collection(collectionName);

  return await collection.find({ date: { $gte: new Date() } }).toArray();
};
