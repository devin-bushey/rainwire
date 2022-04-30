const cheerio = require('cheerio');
const axios = require('axios');

// TESTING:
// node -e 'require("./extract_vic_songkick.js").extract()'
module.exports = {

    extract: function () {

        return new Promise(async function (resolve, reject) {
            try {

                const html = await axios.get('https://www.songkick.com/metro-areas/27399-canada-victoria?page=2#metro-area-calendar');
                const $ = await cheerio.load(html.data);

                let data = [];

                $('.event-listings-element').each(function (index, element) {

                    var band_name = $(element).find('p.artists').text().trim();

                    var band_name_reduced = "";
                    //const escape_chars = ['w/', '&', '-', "vs", " at ", "*CANCELLED*",];
                    const escape_chars = ["\n"];
                    for (let i = 0; i < escape_chars.length; i++) {

                        if (band_name.includes(escape_chars[i])) {
                            band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
                            break;
                        }
                        else {
                            band_name_reduced = band_name;
                        }

                    }

                    var dateString = $(element).find('time').attr('datetime');
                    var date_reduced = dateString.substring(0, 10);

                    var venue = $(element).find('.venue-link').text().trim();


                    data.push(
                        {
                            ticket_band: band_name_reduced,
                            ticket_date: date_reduced + ' @ ' + venue,
                            date: dateString,
                        }
                    );
                });

                resolve(data);
                console.log("Successfully extracted Victoria SongKick Page 02");

            }
            catch (err) {
                reject("error: Victoria SongKick Page 02 extraction")
                console.log("error: Victoria SongKick Page 02 extraction");
            }

        });
    }
}




