import { PLAYLIST_IMG_RS } from "../../assets/recordshop_img";
import { get } from "../../http/request";
import { SpotifyPlaylistDataType } from "../../types/SpotifyTypes";
import { AddCoverArt, AddTracksToPlaylist, CreateBlankPlaylist } from "../createPlaylist";

export const CreateNewPlaylistJamBase = async ({
  token,
  city,
  user_id,
  numTopTracks,
  spotifyIds,
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  spotifyIds: string[];
}) => {
  const playlist_data: SpotifyPlaylistDataType = await CreateBlankPlaylist({
    token,
    city,
    user_id,
  });

  const playlist_id = playlist_data.new_playlist_id || "";
  try {
    AddCoverArt({ token, playlist_id, coverArt: PLAYLIST_IMG_RS });
  } catch (err) {
    console.log("Error adding cover art");
  }

  const numTopTracksToAdd = numTopTracks ? numTopTracks : 1;

  const promises = spotifyIds.map(async (spotifyId) => {
    const topTracks: any = await getTopTracks(spotifyId, token);
    let tracks = "";
    try {
      for (let i = 0; i < numTopTracksToAdd; i++) {
        if (topTracks && topTracks[i]) {
          tracks += topTracks[i];
          tracks += ",";
        }
      }
    } catch (error) {
      //console.log(error);
    }
    return tracks;
  });
  const trackResults = await Promise.all(promises);

  let tracks = trackResults.join("");

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

async function getTopTracks(spotifyId: string, token: string) {
  try {
    const response = await get({
      url: `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?market=CA`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.tracks.map((track: any) => track.uri);
    } else {
      //console.log('Unexpected response status:', response.status);
    }
  } catch (error) {
    //console.log('Error at fetching top tracks:', error);
  }
  return null; // Return null in case of errors
}
