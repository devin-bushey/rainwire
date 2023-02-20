import axios from 'axios';

export const GetTickets = async (city: string) => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + city + '/')
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
