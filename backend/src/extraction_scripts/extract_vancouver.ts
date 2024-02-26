import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_vancouver = async () => {
  console.log('Extracting https://www.redcat.ca/');

  let $: any;
  let data: any[] = [];

  await get({
    url: 'https://www.redcat.ca/',
  })
    .then(async (res: any) => {
      $ = cheerio.load(res.data);
    })
    .then((res: any) => {
      $('a.ticket').each(function (index: any, element: any) {
        // try to format band name
        // TODO: clean this up
        var band_name = $(element).find('h3').text().trim();
        var band_name_reduced = '';
        const escape_chars = ['(', '-', '&', 'vs', 'ticket'];

        for (let i = 0; i < escape_chars.length; i++) {
          if (band_name.includes(escape_chars[i])) {
            band_name_reduced = band_name
              .substring(0, band_name.indexOf(escape_chars[i]))
              .trim();
            break;
          } else {
            band_name_reduced = band_name;
          }
        }

        data.push({
          ticket_band: band_name_reduced,
          ticket_date: $(element).find('p.ticket__venue').text().trim(),
          ticket_price: $(element).find('p.ticket__price').text().trim(),
        });
      });
      console.log('Successfully extracted Red Cat Records');
      return data;
    })
    .catch((err: any) => {
      console.log(err);
      console.log('Error: Extracted Red Cat Records Failure');
    });

  return data;
};
