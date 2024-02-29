import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_phillips_backyarder = async () => {
  console.log('Extracting phillips backyarder');
  let data: any[] = [];

  await get({
    url: 'https://www.phillipsbackyard.com/',
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);
      $('.sqs-col-6').each(function (index, element) {
        var band_names = $(element).find('span.accordion-item__title');

        const DAYS_TILT = ['July 7', 'July 8', 'July 9'];
        const DAYS_REVERB = ['August 11', 'August 12', 'August 13'];

        if (band_names) {
          band_names.each(function (i, element) {
            const band = $(element).text().trim();

            let day: string = '';
            let date: string = '';
            const venue = index === 0 ? 'TILT' : 'REVERB';
            if (index === 0) {
              if (i <= 4) {
                day = DAYS_TILT[0];
                date = '2023-07-07';
              } else if (i <= 10) {
                day = DAYS_TILT[1];
                date = '2023-07-08';
              } else {
                day = DAYS_TILT[2];
                date = '2023-07-09';
              }
            } else {
              if (i <= 4) {
                day = DAYS_REVERB[0];
                date = '2023-08-11';
              } else if (i <= 9) {
                day = DAYS_REVERB[1];
                date = '2023-08-12';
              } else {
                day = DAYS_REVERB[2];
                date = '2023-08-13';
              }
            }

            data.push({
              artist: band,
              ticket_date: day + ' at ' + venue,
              venue: venue,
              date: date,
              day: day,
              popularity: index === 0 ? i : 100 + i,
            });
          });
        }
      });
      return data;
    })
    .catch((error: any) => {
      console.log(error);
      console.log('Error extracting philips backyarder');
    });

  return data;
};
