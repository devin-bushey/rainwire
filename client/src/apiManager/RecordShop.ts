import axios from "axios";
import { filterRecent, sortByPopularity, sortDataByDateAndOrder } from "../utils/sorter";
import { Cities, Festivals } from "../constants/enums";

export const GetTickets = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  const [_key, { origin }] = queryKey;

  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + "artists/", {
      params: {
        city: origin,
      },
    })
    .then(async (response) => {
      if (origin === Cities.Victoria_2024) {
        const sorted = sortDataByDateAndOrder(response.data);
        return filterRecent(sorted);
      }
      if (origin === Festivals.LaketownShakedown_2024) {
        const ordered = sortByPopularity(response.data);
        return ordered;
      }
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
  return await axios.post(import.meta.env.VITE_SITE_URL_DB + "create/", reqBody);
};
