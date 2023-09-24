import axios from 'axios';
import { filterRecent, sortDataByDateAndOrder } from '../utils/sorter';
import { Cities } from '../constants/enums';

function removeDuplicatesByPropertyName<T>(dataArray: T[], propertyName: keyof T): T[] {
  const seenNames = new Set<T[keyof T]>();
  const uniqueData = dataArray.filter((item) => {
    if (!seenNames.has(item[propertyName])) {
      seenNames.add(item[propertyName]);
      return true;
    }
    return false;
  });
  return uniqueData;
}

export const GetJamBase = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  const [_key, { origin }] = queryKey;

  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + 'jamBase/', {
      params: {
        city: origin,
      },
    })
    .then(async (response) => {
      const duplicatesRemoved = removeDuplicatesByPropertyName(response.data, 'artistName');
      const removeNonSpotify = duplicatesRemoved.filter((ticket: any) => {
        return ticket.spotifyId;
      });
      return removeNonSpotify;
    });
};

export const CreateNewPlaylistJamBase = async ({
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
  return await axios.post(import.meta.env.VITE_SITE_URL_DB + 'createJamBase/', reqBody);
};

export const GetTickets = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  const [_key, { origin }] = queryKey;

  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + 'artists/', {
      params: {
        city: origin,
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
