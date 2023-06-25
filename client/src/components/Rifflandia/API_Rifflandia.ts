import axios from 'axios';
import { sortDataByDateAndOrder } from '../../helpers/sorter';

export const GetTicketsRifflandia = async (): Promise<any> => {
  return axios.get(import.meta.env.VITE_SITE_URL_DB + 'rifflandia/').then(async (response) => {
    return sortDataByDateAndOrder(response.data);
  });
};

export const CreateNewPlaylistRifflandia = async ({
  token,
  user_id,
  numTopTracks,
  days,
}: {
  token: string;
  user_id: string;
  numTopTracks?: number;
  days: any;
}) => {
  const reqBody = {
    token: token,
    user_id: user_id,
    numTopTracks: numTopTracks,
    days: days,
  };
  return await axios.post(import.meta.env.VITE_SITE_URL_DB + 'rifflandia-create/', reqBody);
};
