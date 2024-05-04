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
  const tracks = [];

  const limit = 50;
  let offset = 0;
  let response;

  do {
    try {
      response = await get({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          offset,
          limit,
        },
      });

      tracks.push(...response.data.items.map((item: any) => item.track));
      offset += limit;
    } catch (error) {
      console.log("Error at getPlaylistItems:", error);
    }
  } while (response?.data?.total > offset);

  return tracks;
};

export const removePlaylistItems = async ({
  token,
  playlistId,
  tracks,
}: {
  token: string;
  playlistId: string;
  tracks: any[];
}) => {
  let deletedTrackCount = 0;

  do {
    const batchedTracks = tracks.splice(0, 100);

    try {
      await delete_({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { tracks: batchedTracks.map((track: any) => ({ uri: track.uri })) },
      });
    } catch (error) {
      console.log("Error at removePlaylistItems:", error);
    }

    deletedTrackCount += batchedTracks.length;
  } while (tracks.length);

  console.log(`Deleted ${deletedTrackCount} tracks from playlist.`);

  return deletedTrackCount;
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
  let addedTracksCount = 0;
  do {
    const batchedGigs = tracks.splice(0, 75);
    const batchedTracks = batchedGigs.map((gig) => gig.artist.topTracks[0]);

    try {
      await post({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          uris: batchedTracks,
        },
      });
    } catch (error) {
      console.log("Error at addPlaylistItems:", error);
    }

    addedTracksCount += batchedTracks.length;
  } while (tracks.length);

  console.log(`Added ${addedTracksCount} tracks to playlist.`);

  return addedTracksCount;
};
