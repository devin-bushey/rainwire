import { delete_, get, post } from "../http/request";

export const getPlaylistId = async ({
  token,
  user_id,
  playlistName,
}: {
  token: string;
  user_id: string;
  playlistName: string;
}) => {
  try {
    const response = await get({
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // TODO: Just gets the first match. There may be more than one playlist with the same name
    for (const playlist of response.data.items) {
      if (playlist.name === playlistName) {
        return playlist.id;
      }
    }
  } catch (error) {
    console.log("Error at checkIfPlaylistExists:", error);
  }
};

export const getPlaylistItems = async ({ token, playlistId }: { token: string; playlistId: string }) => {
  try {
    const response = await get({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const tracks = [];
    for (const item of response.data.items) {
      tracks.push(item.track.uri);
    }
    return tracks;
  } catch (error) {
    console.log("Error at checkIfPlaylistExists:", error);
  }
  return [];
};

export const removePlaylistItems = async ({
  token,
  playlistId,
  tracks,
}: {
  token: string;
  playlistId: string;
  tracks: string[];
}) => {
  try {
    await delete_({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { tracks: tracks.map((uri) => ({ uri: uri })) },
    });
  } catch (error) {
    console.log("Error at removePlaylistItems:", error);
  }
};

export const addPlaylistItems = async ({
  token,
  playlistId,
  tracks,
}: {
  token: string;
  playlistId: string;
  tracks: string[];
}) => {
  try {
    await post({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uris: tracks,
      },
    });
  } catch (error) {
    console.log("Error at addPlaylistItems:", error);
  }
};
