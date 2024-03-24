import axios from "axios";
import { filterRecent, sortDataByDateAndOrder } from "../../../utils/sorter";
import { Cities } from "../../../constants/enums";

export const getTicketsCities = async (collectionName: string): Promise<any> => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + "artists/", {
      params: {
        city: collectionName,
      },
    })
    .then(async (response) => {
      if (origin === Cities.Victoria) {
        const sorted = sortDataByDateAndOrder(response.data);
        return filterRecent(sorted);
      }
      return sortDataByDateAndOrder(response.data);
    });
};
