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

      const date = ['June 30', 'July 1', 'July 2'];
      const day = ['Friday', 'Saturday', 'Sunday'];

      $('.o-lineup__day').each(function (index, element) {
        $(element)
          .find('.m-card__heading-container')
          .each(function (i, e) {
            var band_name = $(e).find('h3.m-card__heading').text().trim();
            //console.log(band_name);
            data.push({
              ticket_band: band_name,
              ticket_date: day[index] + ', ' + date[index] + ' @ Cowichan Lake',
              date: date[index],
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
      console.log('Error laketown shakedown');
    });

  return data;
};
