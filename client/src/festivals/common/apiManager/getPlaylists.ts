import axios from "axios";

export const getPlaylists = async (token: string, user_id: string, playlistName: string): Promise<any> => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + "playlists/", {
      params: {
        token: token,
        userId: user_id,
        playlistName: playlistName,
      },
    })
    .then(async (response) => {
      return response.data;
    });
};
