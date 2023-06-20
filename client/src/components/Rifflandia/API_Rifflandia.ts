import axios from 'axios';

export const GetTicketsRifflandia = async (): Promise<any> => {
  return axios.get(import.meta.env.VITE_SITE_URL_DB + 'rifflandia/').then(async (response) => {
    return sortDataByDateAndOrder(response.data);
  });
};

const sortDataByDateAndOrder = (data: any) => {
  data.sort((a: any, b: any) => {
    // First, compare the dates
    const dateA = new Date(a.day);
    const dateB = new Date(b.day);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      // If the dates are the same, compare the orders
      return a.order - b.order;
    }
  });

  return data;
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
