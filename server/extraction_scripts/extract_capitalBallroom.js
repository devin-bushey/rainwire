const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {

    extract: function () {

        return new Promise(async function (resolve, reject) {
            try {

                const html = await axios.get('https://thecapitalballroom.com/all-events/');
                const $ = await cheerio.load(html.data);

                let data = [];

                $('div.row.all-events-row').each(function (index, element) {

                    var band_name = $(element).find('a.title').text().trim();
                    //console.log(band_name);
                    var band_name_reduced = "";
                    //const escape_chars = ['w/', '&', '-', "vs", " at ", "*CANCELLED*",];
                    const escape_chars = ["–"];
                    for (let i = 0; i < escape_chars.length; i++) {

                        if (band_name.includes(escape_chars[i])) {
                            band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
                            break;
                        }
                        else {
                            band_name_reduced = band_name;
                        }

                    }
                    if (band_name.includes("Presents:") || band_name.includes("PRESENTS:")) {
                        band_name_reduced = band_name.substring((band_name.indexOf(":") + 1)).trim();
                    }
                    if (band_name.includes("*CANCELLED*")) {
                        band_name_reduced = band_name.substring((band_name.indexOf("D") + 2)).trim();
                    }
                    //console.log(band_name_reduced);

                    const venue = "Capital Ballroom";

                    var month = $(element).find('p.month').text().trim();
                    var date = $(element).find('p.date').text().trim();
                    var day = $(element).find('p.day').text().trim();
                    var date_reduced = month + " " + date;
                    //console.log(date_reduced);

                    const d = new Date();
                    let year = d.getFullYear();
                    var date_sort = date_reduced + " " + year;

                    data.push(
                        {
                            ticket_band: band_name_reduced,
                            ticket_date: date_reduced + ' @ ' + venue,
                            date: date_sort,
                        }
                    );

                });
                resolve(data);
                console.log("Successfully extracted https://thecapitalballroom.com/all-events/");

            }
            catch (err) {
                reject("error: capital ballroom extraction")
                console.log("error: capital ballroom extraction");
            }

        });
    }
}




