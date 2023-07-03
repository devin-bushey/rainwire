import axios from 'axios';
import { sortDataByDateAndOrder } from '../helpers/sorter';

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
