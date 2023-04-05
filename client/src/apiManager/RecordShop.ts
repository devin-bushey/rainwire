import axios from 'axios';
import moment from 'moment';

const sortTicketsByDate = (tickets: any) => {
  console.log(tickets);
  tickets.sort((a: any, b: any) => {
    let datea = a.ticket_date.split('@')[0];
    let dateb = b.ticket_date.split('@')[0];

    if (datea.length < 10) {
      datea = moment(datea, 'MMM DD').format('MM-DD');
      datea = moment().format('YYYY') + '-' + datea;
    }

    if (dateb.length < 10) {
      dateb = moment(datea, 'MMM DD').format('MM-DD');
      dateb = moment().format('YYYY') + '-' + datea;
    }

    //const formatted = moment(datea).format('YYYY-MM-DD');

    // console.log('datea', datea);
    // console.log('formatted', formatted);

    const dateA = new Date(datea);
    const dateB = new Date(dateb);
    return dateA.getTime() - dateB.getTime();
  });
  return tickets;
};

export const GetTickets = async (city: string) => {
  return axios
    .get(import.meta.env.VITE_SITE_URL_DB + city + '/')
    .then((response) => {
      // response.data = sortTicketsByDate(response.data);

      response.data.sort((a: any, b: any) => {
        // let a_date = a.ticket_date.split('@')[0];
        // let b_date = b.ticket_date.split('@')[0];

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
