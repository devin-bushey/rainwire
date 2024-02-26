import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_osheaga = async () => {
  console.log('Extracting osheaga');
  let data: any[] = [];

  await get({
    url: 'https://consequence.net/festival/osheaga-music-and-arts-festival-2023-tickets-lineup/'
  })
  .then((response: any) => {
    const $ = cheerio.load(response.data);

    const date = ['August 4', 'August 5', 'August 6'];
    const day = ['Friday', 'Saturday', 'Sunday'];

    $('.festival-lineup').each(function (index, element) {
      $(element)
        .find('ul')
        .each(function (i, e) {
          $(e)
            .find('li')
            .each(function (i2, e2) {
              var band_name = $(e2).text().trim();
              data.push({
                ticket_band: band_name,
                ticket_date: day[i] + ', ' + date[i] + ' @ Osheaga, Montreal',
                date: date[i],
              });
            });
        });
    });
    return data;
  })
  .then((data) => {
    //console.log('data', data);
    return data;
  })
  .catch((error: any) => {
    console.log(error);
    console.log('Error osheaga');
  });

  return data;
};
