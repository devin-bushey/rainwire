import axios from "axios";
import { filterRecent, sortByPopularity, sortDataByDateAndOrder } from "../utils/sorter";
import { Cities, Festivals } from "../constants/enums";
import { Gig } from "../types/Gig";

export const getGigsFromRecordShop = async (collectionName: string): Promise<Gig[]> => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + "artists/", {
      params: {
        city: collectionName,
      },
    })
    .then(async (response) => {
      if (collectionName === Cities.Victoria_2024) {
        const sorted = sortDataByDateAndOrder(response.data);
        return filterRecent(sorted);
      }
      if (
        collectionName === Festivals.PachenaBay ||
        collectionName === Festivals.PhillipsBackyard2024 ||
        collectionName === Festivals.LaketownShakedown_2024
      ) {
        return sortByPopularity(response.data);
      }

      return sortDataByDateAndOrder(response.data);
    });
};
