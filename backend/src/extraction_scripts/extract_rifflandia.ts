import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_rifflandia = async (weekend: 'electric-avenue' | 'the-park') => {
  console.log('Extracting rifflandia');
  let data: any[] = [];

  await get({
    url: `https://rifflandia.com/${weekend}`,
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const date = ['April 14', 'April 15', 'April 16'];
      const day = ['Friday', 'Saturday', 'Sunday'];
      const tbd = weekend === 'electric-avenue' ? 'Sept 7-9' : 'Sept 15-17';
      const days = weekend === 'electric-avenue' ? '2023-09-07' : '2023-09-15';
      const venue = weekend === 'electric-avenue' ? 'Electric Avenue' : 'The Park';

      $('button').each(function (index, element) {
        //console.log(element);
        var band_name = $(element).text().trim();
        data.push({
          ticket_band: band_name,
          ticket_date: tbd + ' @ ' + venue,
          date: tbd,
        });
      });
      return data;
    })
    .catch((error: any) => {
      console.log(error);
      console.log('Error rifflandia');
    });

  return data;
};
