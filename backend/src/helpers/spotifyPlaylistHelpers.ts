import { delete_, get, post } from "../http/request";

export const getPlaylist = async ({
  token,
  user_id,
  playlistName,
}: {
  token: any;
  user_id: any;
  playlistName: any;
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
        return {
          id: playlist.id,
          name: playlist.name,
          image: playlist.images[0],
          uri: playlist.uri,
        };
      }
    }
  } catch (error) {
    console.log("Error at checkIfPlaylistExists:", error);
  }
};

export const getPlaylistItems = async ({ token, playlistId }: { token: any; playlistId: any }) => {
  try {
    const response = await get({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const tracks = [];
    for (const item of response.data.items) {
      tracks.push(item.track);
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
      data: { tracks: tracks.map((track: any) => ({ uri: track.uri })) },
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
  token: any;
  playlistId: any;
  tracks: any[];
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
