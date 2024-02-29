import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_philips_backyarder = async () => {
  console.log('Extracting philips backyarder');
  let data: any[] = [];

  await get({
    url: 'https://www.phillipsbackyard.com/',
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);
      $('.sqs-col-6').each(function (index, element) {
        //var p_date = $(element).find('div.sqs-block-content');
        var band_names = $(element).find('span.accordion-item__title');

        // p_date.each(function (index, element) {
        //   const test = $(element).find('h3').text().trim();
        //   console.log('p_date', test);
        // });

        // band_names.each(function (index, element) {
        //   const test = $(element).text().trim();
        //   console.log('element', test);
        // });

        if (band_names) {
          band_names.each(function (index, element) {
            const band = $(element).text().trim();
            data.push({
              ticket_band: band,
              ticket_date: '2023-07-07' + ' @ ' + 'Phillips Backyarder',
              date: '2023-07-07',
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
