import axios from 'axios';
import { sortDataByDateAndOrder } from '../utils/sorter';

export const GetTickets = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  const [_key, { origin }] = queryKey;

  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + 'artists/', {
      params: {
        city: origin,
      },
    })
    .then(async (response) => {
      return sortDataByDateAndOrder(response.data);
    });
};

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks,
  days,
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  days?: any;
}) => {
  const reqBody = {
    token: token,
    user_id: user_id,
    city: city,
    numTopTracks: numTopTracks,
    days: days,
  };
  return await axios.post(import.meta.env.VITE_SITE_URL_DB + 'create/', reqBody);
};
