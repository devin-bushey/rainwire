import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_laketown_shakedown = async () => {
  console.log('Extracting laketown shakedown');
  let data: any[] = [];

  await get({
    url: 'https://www.laketownshakedown.com/lineup/',
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const date = ['July 2', 'July 1', 'June 30'];
      const day = ['Sunday', 'Saturday', 'Friday'];

      $('.o-lineup__day').each(function (index, element) {
        $(element)
          .find('.m-card__heading-container')
          .each(function (i, e) {
            var band_name = $(e).find('h3.m-card__heading').text().trim();
            //console.log(band_name);
            // data.push({
            //   ticket_band: band_name,
            //   ticket_date: day[index] + ', ' + date[index] + ' @ Cowichan Lake',
            //   date: date[index],
            // });
            data.push({
              artist: band_name,
              ticket_date: day[index] + ', ' + date[index],
              venue: 'Cowichan',
              date: date[index],
              day: date[index],
              popularity: index * 100 + i,
            });
          });
      });
      return data;
    })
    .catch((error: any) => {
      console.log(error);
      console.log('Error laketown shakedown');
    });

  return data;
};
