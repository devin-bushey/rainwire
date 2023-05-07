import axios from 'axios';
import moment from 'moment';

export const GetTickets = async (city: string) => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + 'tickets/', {
      params: {
        city: city,
      },
    })
    .then((response) => {
      response.data.sort((a: any, b: any) => {
        let a_date = a.date;
        let b_date = b.date;

        if (a_date.length < 10) {
          a_date = moment(a_date, 'MMM DD').format('MM-DD');
          a_date = moment().format('YYYY') + '-' + a_date;
        }

        if (b_date.length < 10) {
          b_date = moment(a_date, 'MMM DD').format('MM-DD');
          b_date = moment().format('YYYY') + '-' + a_date;
        }

        const dateA = new Date(a_date);
        const dateB = new Date(b_date);
        return dateA.getTime() - dateB.getTime();
      });

      return response.data;
    })
    .catch((error) => {
      console.log('Error GetTickets', error);
      return [];
    });
};
