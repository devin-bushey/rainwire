import * as cheerio from 'cheerio';
import axios from 'axios';

export const extract_rifflandia = async (weekend: 'electric-avenue' | 'the-park') => {
  console.log('Extracting rifflandia ' + weekend);
  let data: any[] = [];

  await axios
    .get(`https://rifflandia.com/${weekend}`)
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      const tbd = weekend === 'electric-avenue' ? 'Sept 7-9' : 'Sept 15-17';
      const venue = weekend === 'electric-avenue' ? 'Electric Avenue' : 'The Park';

      const DAYS_ELECTRIC = ['Sept 7', 'Sept 8', 'Sept 9'];
      const DAYS_PARK = ['Sept 15', 'Sept 16', 'Sept 17'];

      $('button').each(function (index, element) {
        //console.log(element);
        const dayIndex = index % DAYS_ELECTRIC.length;
        var band_name = $(element).text().trim();
        data.push({
          ticket_band: band_name,
          ticket_date: tbd + ' @ ' + venue,
          weekend: venue,
          date: tbd,
          day: venue === 'Electric Avenue' ? DAYS_ELECTRIC[dayIndex] : DAYS_PARK[dayIndex],
          orderNum: venue === 'Electric Avenue' ? 100 + index : 200 + index,
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
      console.log('Error rifflandia');
    });

  return data;
};
