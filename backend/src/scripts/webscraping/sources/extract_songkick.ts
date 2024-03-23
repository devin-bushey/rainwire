import * as cheerio from "cheerio";
import { get } from "../../../http/request";

export const extract_songkick = async (url: string) => {
  console.log("Extracting song kick " + url);
  let data: any[] = [];

  await get({
    url,
  })
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      $(".event-listings-element").each(function (index, element) {
        var band_name = $(element).find("p.artists").text().trim();
        var band_name_reduced = "";
        const escape_chars = ["\n"];
        for (let i = 0; i < escape_chars.length; i++) {
          if (band_name.includes(escape_chars[i])) {
            band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
            break;
          } else {
            band_name_reduced = band_name;
          }
        }

        var dateString = $(element).find("time").attr("datetime");
        var date_reduced = dateString?.substring(0, 10);

        var venue = $(element).find(".venue-link").text().trim();

        data.push({
          artist: band_name_reduced,
          ticket_date: `${date_reduced} at ${venue}`,
          venue: venue,
          date: date_reduced,
          popularity: index,
        });
      });
      return data;
    })
    .catch((error: any) => {
      console.log(error);
      console.log("Error extracting songkick");
    });

  return data;
};
