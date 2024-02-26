import * as cheerio from 'cheerio';
import { get } from '../http/request';

export const extract_vic_songkick_2 = async () => {
  console.log('Extracting song kick 2');
  let data: any[] = [];

  await get({
    url: 'https://www.songkick.com/metro-areas/27399-canada-victoria?page=2#metro-area-calendar'
  })
  .then((response: any) => {
    const $ = cheerio.load(response.data);

    $('.event-listings-element').each(function (index, element) {
      var band_name = $(element).find('p.artists').text().trim();

      var band_name_reduced = '';
      //const escape_chars = ['w/', '&', '-', "vs", " at ", "*CANCELLED*",];
      const escape_chars = ['\n'];
      for (let i = 0; i < escape_chars.length; i++) {
        if (band_name.includes(escape_chars[i])) {
          band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
          break;
        } else {
          band_name_reduced = band_name;
        }
      }

      var dateString = $(element).find('time').attr('datetime');
      var date_reduced = dateString?.substring(0, 10);

      var venue = $(element).find('.venue-link').text().trim();

      data.push({
        ticket_band: band_name_reduced,
        ticket_date: date_reduced + ' @ ' + venue,
        date: dateString,
      });
    });
    return data;
  })
  .catch((error: any) => {
    console.log(error);
    console.log('Error extracting songkick2');
  });

  return data;
};
