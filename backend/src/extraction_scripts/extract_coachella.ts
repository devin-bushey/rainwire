import * as cheerio from 'cheerio';
import axios from 'axios';

export const extract_coachella = async () => {
  console.log('Extracting coachella');
  let data: any[] = [];

  await axios
    .get('https://pitchfork.com/news/coachella-2023-lineup-and-schedule-all-the-set-times-you-need-to-know/')
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

                var band_name_reduced = band_name.substring(0, band_name.indexOf('(')).trim();

                data.push({
                  ticket_band: band_name_reduced,
                  ticket_date: day[i] + ', ' + date[i] + ' @ Coachella Valley, CA',
                  date: date[i],
                });
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
      console.log('Error osheaga');
    });

  return data;
};
