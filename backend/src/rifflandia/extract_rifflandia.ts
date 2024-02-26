import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_rifflandia = async (
  weekend: 'electric-avenue' | 'the-park',
) => {
  console.log('Extracting rifflandia ' + weekend);
  let data: any[] = [];

  await get({
    url: `https://rifflandia.com/${weekend}`,
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const venue =
        weekend === 'electric-avenue' ? 'Electric Avenue' : 'The Park';

      const DAYS_ELECTRIC = ['Sept 7', 'Sept 8', 'Sept 9'];
      const DAYS_PARK = ['Sept 15', 'Sept 16', 'Sept 17'];

      $('.font-extrabold').each(function (i, e) {
        $(e)
          .find('button')
          .each(function (index, element) {
            let dayI: number;
            if (i === 18) {
              dayI = 0;
            } else if (i === 21) {
              dayI = 1;
            } else {
              dayI = 2;
            }
            const dayIndex = dayI % DAYS_ELECTRIC.length;
            var band_name = $(element).text().trim();
            data.push({
              ticket_band: band_name,
              ticket_date:
                venue === 'Electric Avenue'
                  ? DAYS_ELECTRIC[dayIndex]
                  : DAYS_PARK[dayIndex] + ' @ ' + venue,
              weekend: venue,
              date:
                venue === 'Electric Avenue'
                  ? DAYS_ELECTRIC[dayIndex]
                  : DAYS_PARK[dayIndex],
              day:
                venue === 'Electric Avenue'
                  ? DAYS_ELECTRIC[dayIndex]
                  : DAYS_PARK[dayIndex],
              orderNum:
                venue === 'Electric Avenue'
                  ? 100000 + i * 100 + index
                  : 200000 + i * 100 + index,
            });
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
