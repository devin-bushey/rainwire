import axios from 'axios';

export const GetTickets = async (city: string) => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + city + '/')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('Error GetTickets', error);
      return [];
    });
};
