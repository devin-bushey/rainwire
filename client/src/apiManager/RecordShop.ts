import axios from "axios";
import { filterRecent, sortByPopularity, sortDataByDateAndOrder } from "../utils/sorter";
import { Cities, Festivals } from "../constants/enums";
import { Gig } from "../types/Gig";

export const GetTickets = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  // eslint-disable-next-line
  const [_key, { origin }] = queryKey;

  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + "artists/", {
      params: {
        city: origin,
      },
    })
    .then(async (response) => {
      if (
        origin === Cities.Victoria_2024 ||
        origin === Cities.Vancouver ||
        origin === Cities.Toronto ||
        origin === Cities.Pleasanton ||
        origin === Cities.SanFrancisco
      ) {
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
  overrideGigs,
  sortBy = "date",
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  overrideGigs?: Gig[];
  sortBy?: "popularity" | "date";
}) => {
  return await axios.post(import.meta.env.VITE_SITE_URL_DB + "create/", {
    token,
    user_id,
    city,
    numTopTracks,
    sortBy,
    overrideGigs,
  });
};
