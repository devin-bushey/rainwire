import { SpotifyPlaylistDataType } from "../types/SpotifyTypes";
import { PLAYLIST_IMG_RS } from "../assets/recordshop_img";
import { sortByPopularity } from "./sortByPopularity";
import { sortByDateDescending } from "./sortByDateDescending";
import { filterRecent } from "./filterRecent";
import { get, post, put } from "../http/request";
import { HttpRequestError } from "../http/HttpRequestError";
import { Cities } from "../enums/Cities";
import { Festivals } from "../enums/Festivals";
import { Gig } from "../types/Gig";

export interface PlaylistCreationParams {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  gigs: Gig[];
  sortBy?: "popularity" | "date";
}

export const createNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks = 1,
  gigs,
  sortBy = "date",
}: PlaylistCreationParams): Promise<string | undefined> => {
  const playlistData: SpotifyPlaylistDataType = await createBlankPlaylist({ token, city, user_id });

  if (!playlistData.new_playlist_id) return;

  try {
    await addCoverArt({ token, playlist_id: playlistData.new_playlist_id });
  } catch (err) {
    console.log("Error adding cover art");
  }

  let sortedGigs = sortBy === "popularity" ? sortByPopularity(gigs) : sortByDateDescending(gigs);

  if (city === Cities.Victoria_2024) {
    sortedGigs = filterRecent(sortedGigs);
  }

  let tracks = sortedGigs
    .map((gig) => gig.artist.topTracks?.slice(0, numTopTracks).join(","))
    .filter((track) => track)
    .join(",");

  const MAX_CHUNK_LENGTH = 75;
  const trackArrays = [];

  while (tracks.length > 0) {
    const chunk = tracks.substring(0, MAX_CHUNK_LENGTH);
    trackArrays.push(chunk);
    tracks = tracks.substring(MAX_CHUNK_LENGTH);
  }

  for (const trackArray of trackArrays) {
    if (playlistData.new_playlist_id && playlistData.external_urls?.spotify) {
      await addTracksToPlaylist(token, playlistData.new_playlist_id, trackArray);
    }
  }

  return playlistData.external_urls?.spotify;
};

export const createBlankPlaylist = async ({
  token,
  city,
  user_id,
}: {
  token: string;
  city: string;
  user_id: string;
}): Promise<SpotifyPlaylistDataType> => {
  let playlist_name = `record shop ${city}`;

  if (city === Cities.Victoria_2024) {
    playlist_name = "record shop victoria";
  } else if (city === Festivals.LaketownShakedown_2024) {
    playlist_name = "record shop laketown shakedown";
  } else if (city === Festivals.PachenaBay) {
    playlist_name = "record shop pachena bay";
  }

  const description = `a mixtape created by recordshop.cool`;

  try {
    const response = await post({
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: playlist_name,
        description: description,
        public: true,
      },
    });

    const data = response.data;

    return {
      new_playlist_id: data.id,
      external_urls: {
        spotify: data.external_urls.spotify,
      },
    };
  } catch (error) {
    console.log("Error: CreateBlankPlaylist");
    console.log(error);

    throw Error("Error: CreateBlankPlaylist");
  }
};

export const addCoverArt = async ({ token, playlist_id }: { token: string; playlist_id: string }) => {
  try {
    await put({
      url: `https://api.spotify.com/v1/playlists/${playlist_id}/images`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
      data: PLAYLIST_IMG_RS,
    });
  } catch (error) {
    console.log("Error: unsuccessfully added cover art to playlist");
  }
};

export const addTracksToPlaylist = async (token: string, playlist_id: string, tracks: string) => {
  return post({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=" + tracks,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch(function (error) {
    const err = error as HttpRequestError;
    console.log("Error: unsuccessfully added tracks to playlist");
    console.log(err.message);
    return null;
  });
};
