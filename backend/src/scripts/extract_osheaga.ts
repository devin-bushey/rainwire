import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_osheaga = async () => {
  console.log('Extracting osheaga');
  let data: any[] = [];

  await get({
    url: 'https://www.jambase.com/festival/osheaga-2023',
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const DAY = ['August 4', 'August 5', 'August 6'];
      const DATE = ['2023-08-04', '2023-08-05', '2023-08-06'];
      //console.log('test', response);

      $('.list-festival-lineup').each(function (index, element) {
        $(element)
          .find('.performance')
          .each(function (i, e) {
            var band_name = $(e).text().trim();

            let day: string = '';
            let date: string = '';

            day = DAY[index];
            date = DATE[index];

            data.push({
              artist: band_name,
              ticket_date: day,
              venue: 'Osheaga',
              date: date,
              day: day,
              popularity: index * 100 + i,
            });
          });
      });
      return data;
    })
    .catch((error: any) => {
      console.log(error);
      console.log('Error osheaga');
    });

  return data;
};
