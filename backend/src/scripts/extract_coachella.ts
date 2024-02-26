import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_coachella = async () => {
  console.log('Extracting coachella');
  let data: any[] = [];

  await get({
    url: 'https://pitchfork.com/news/coachella-2023-lineup-and-schedule-all-the-set-times-you-need-to-know/',
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const date = ['April 14', 'April 15', 'April 16'];
      const day = ['Friday', 'Saturday', 'Sunday'];

      $('.body__inner-container').each(function (index, element) {
        $(element)
          .find('ul')
          .each(function (i, e) {
            $(e)
              .find('li')
              .each(function (i2, e2) {
                var band_name = $(e2).text().trim();

                var band_name_reduced = band_name
                  .substring(0, band_name.indexOf('('))
                  .trim();

                data.push({
                  artist: band_name_reduced,
                  ticket_date:
                    day[i] + ', ' + date[i] + ' @ Coachella Valley, CA',
                  venue: 'Coachella',
                  date: date[i],
                  popularity: index,
                });
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
