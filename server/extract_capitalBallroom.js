const cheerio = require('cheerio');
const axios = require('axios');
const { extract } = require('./extract_ottawa');


function resolveAfter2Seconds() {
    return new Promise(async function (resolve, reject) {
        try {

            console.log("Testing Captial Ballroom");
            const html = await axios.get('https://thecapitalballroom.com/all-events/');
            const $ = await cheerio.load(html.data);

            let data = [];

            $('div.row.all-events-row').each(function (index, element) {

                var band_name = $(element).find('a.title').text().trim();
                //console.log(band_name);
                var band_name_reduced = "";
                const escape_chars = ['w/', '&', '-', "vs", " at "];
                for (let i = 0; i < escape_chars.length; i++) {

                    if (band_name.includes(escape_chars[i])) {
                        band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
                        break;
                    }
                    else {
                        band_name_reduced = band_name;
                    }

                }
                console.log(band_name_reduced);

                const venue = "Capital Ballroom";

                var month = $(element).find('p.month').text().trim();
                var date = $(element).find('p.date').text().trim();
                var day = $(element).find('p.day').text().trim();
                var date_reduced = month + " " + date;
                console.log(date_reduced);



                data.push(
                    {
                        ticket_band: band_name_reduced,
                        ticket_date: date_reduced + ' @ ' + venue,
                    }
                );

            });




            resolve(data);
        }
        catch (err) {
            console.log("error");
            console.log(err);
        }

    });
}

async function asyncCall() {
    const result = await resolveAfter2Seconds();
    //console.log(result);
}

asyncCall();




