import { SpotifyPlaylistDataType } from "../types/SpotifyTypes";
import { PLAYLIST_IMG_RS } from "../assets/recordshop_img";
import { sortByPopularity } from "./sortByPopularity";
import { sortByDateAndOrder } from "./sortByDateAndOrder";
import { filterRecent } from "./filterRecent";
import { get, post, put } from "../http/request";
import { HttpRequestError } from "../http/HttpRequestError";
import { Cities } from "../enums/Cities";
import { Festivals } from "../enums/Festivals";

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks,
  artists,
  sortBy,
  days,
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  artists: any;
  sortBy: string;
  days: string[];
}) => {
  const playlist_data: SpotifyPlaylistDataType = await CreateBlankPlaylist({
    token,
    city,
    user_id,
    days,
  });

  const playlist_id = playlist_data.new_playlist_id || "";
  try {
    await AddCoverArt({ token, playlist_id });
  } catch (err) {
    console.log("Error adding cover art");
  }

  const numTopTracksToAdd = numTopTracks ? numTopTracks : 1;

  let sortedArtists = sortBy === "popularity" ? sortByPopularity(artists) : sortByDateAndOrder(artists);

  if (city === Cities.Victoria) {
    sortedArtists = filterRecent(sortedArtists);
  }

  let tracks = "";

  for (const artist of sortedArtists) {
    try {
      for (let i = 0; i < numTopTracksToAdd; i++) {
        if (artist.topTrackURIs && artist.topTrackURIs[i]) {
          tracks += artist.topTrackURIs[i];
          tracks += ",";
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  tracks = tracks.substring(0, tracks.length - 1); // remove last comma

  const array = tracks.split(",");
  const MAX_CHUNK_LENGTH = 75;
  const trackArrays = [];

  while (array.length > 0) {
    const chunk = array.splice(0, MAX_CHUNK_LENGTH);
    trackArrays.push(chunk);
  }

  for (const trackArray of trackArrays) {
    const tracks = trackArray.join(",");
    if (playlist_data.new_playlist_id && playlist_data.external_urls?.spotify) {
      await AddTracksToPlaylist(token, playlist_data.new_playlist_id, tracks);
    }
  }
  return playlist_data.external_urls?.spotify;
};

export const CreateBlankPlaylist = async ({
  token,
  city,
  user_id,
  days,
}: {
  token: string;
  city: string;
  user_id: string;
  days?: string[];
}): Promise<SpotifyPlaylistDataType> => {
  let playlist_name = "record shop " + city;

  if (city === Festivals.PhilipsBackyard) {
    playlist_name = "record shop phillips backyard";
  }

  if (city === Festivals.LaketownShakedown) {
    playlist_name = "record shop laketown shakedown";
  }

  if (city === Festivals.LaketownShakedown_2024) {
    playlist_name = "record shop laketown shakedown";
  }

  if (city === Festivals.TheFunction) {
    playlist_name = "record shop - the function";
  }

  let description = `a mixtape created by recordshop.cool`;

  return post({
    url: "https://api.spotify.com/v1/users/" + user_id + "/playlists",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      name: playlist_name,
      description: description,
      public: true,
    },
  })
    .then((response) => {
      const data = response.data;

      const returnVal: SpotifyPlaylistDataType = {
        new_playlist_id: data.id,
        external_urls: {
          spotify: data.external_urls.spotify,
        },
      };

      return returnVal;
    })
    .catch(function (error) {
      console.log("Error: CreateBlankPlaylist");
      console.log(error);

      const returnVal: SpotifyPlaylistDataType = {
        new_playlist_id: "",
        external_urls: {
          spotify: "",
        },
      };

      return returnVal;
    });
};

export const AddCoverArt = async ({ token, playlist_id }: { token: string; playlist_id: string }) => {
  return put({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/images",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "image/jpeg",
    },
    data: PLAYLIST_IMG_RS,
  }).catch(function (error) {
    const err = error as HttpRequestError;
    console.log("Error: unsuccessfully added cover art to playlist");
    console.log("***Http Request err: ", err);
    console.log("***JS error: ", error);
    console.log("***");
  });
};

export const AddTracksToPlaylist = async (token: string, playlist_id: string, tracks: string) => {
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
