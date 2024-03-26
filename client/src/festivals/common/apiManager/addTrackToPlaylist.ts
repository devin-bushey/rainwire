import axios from "axios";

export const addTrackToPlaylist = async (token: string, playlistId: string, trackId: string): Promise<any> => {
  return axios
    .post(import.meta.env.VITE_SITE_URL_DB + "playlist/track", {
      token: token,
      playlistId: playlistId,
      trackId: trackId,
    })
    .then(async (response) => {
      return response.data;
    });
};
