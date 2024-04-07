import axios from "axios";
import * as cheerio from "cheerio";
import { buildArtist } from "../model/Artist";
import { buildGig } from "../model/Gig";
require("dotenv").config({ path: "../.env" });

/**
 * USAGE:
 *
 * npx ts-node extractSongkick.ts <DATABASE_URL>
 *
 * For local DBs, use the DB URL is 'mongodb://root:example@localhost:27017/'
 */

const URL_VICTORIA_PAGE_1 = "https://www.songkick.com/metro-areas/27399-canada-victoria?page=1#metro-area-calendar";

export const extractSongkick = async ({ url = URL_VICTORIA_PAGE_1 }: { url?: string }) => {
  console.log("Extracting song kick " + url);
  let gigs: any[] = [];

  await axios
    .get(url)
    .then((response: any) => {
      const $ = cheerio.load(response.data);

      $(".event-listings-element").each(function (index, element) {
        let artistName = $(element).find("p.artists").text().trim();
        let artistNameReduced = "";
        const escape_chars = ["\n"];
        for (let i = 0; i < escape_chars.length; i++) {
          if (artistName.includes(escape_chars[i])) {
            artistNameReduced = artistName.substring(0, artistName.indexOf(escape_chars[i])).trim();
            break;
          } else {
            artistNameReduced = artistName;
          }
        }

        var dateString = $(element).find("time").attr("datetime");
        var dateReduced = dateString?.substring(0, 10);
        var date = dateReduced ? new Date(dateReduced) : undefined;

        var venue = $(element).find(".venue-link").text().trim();

        gigs.push(
          buildGig({
            artist: buildArtist({ name: artistName }),
            venue: venue,
            date: date,
            popularity: index,
          }),
        );
      });
      return gigs;
    })
    .catch((error: any) => {
      console.log(error);
      console.log("Error extracting songkick");
    });

  console.log("data", gigs);

  return gigs;
};

extractSongkick({});
