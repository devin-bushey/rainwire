import axios from 'axios';
import { SpotifyUserDataType } from '../types/SpotifyTypes';

export const GetSpotifyUserInfo = async (token: string): Promise<SpotifyUserDataType> => {
  return axios({
    url: 'https://api.spotify.com/v1/me/',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      const data = response.data;
      const user_name = data.display_name;
      const user_id = data.id;
      const firstName = data.display_name.substring(0, data.display_name.indexOf(' ')).trim();

      return {
        firstName: firstName,
        user_name: user_name,
        user_id: user_id,
        new_playlist_id: '',
        access: true,
        error: false,
      };
    })
    .catch((error: any) => {
      console.log('Error: GetSpotifyUserInfo');
      console.log(error);
      console.log(error.message);

      if (error.response.status === 403) {
        return {
          firstName: '',
          user_name: '',
          user_id: '',
          new_playlist_id: '',
          access: false,
          error: false,
        };
      }

      return {
        firstName: '',
        user_name: '',
        user_id: '',
        new_playlist_id: '',
        access: false,
        error: true,
      };
    });
};

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks,
  tickets,
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  tickets?: any;
}) => {
  const reqBody = {
    token: token,
    user_id: user_id,
    city: city,
    numTopTracks: numTopTracks,
    tickets: tickets,
  };
  return await axios.post(import.meta.env.VITE_SITE_URL_DB + 'create/', reqBody);
};
