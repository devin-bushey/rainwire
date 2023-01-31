const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {

    extract: function () {

        return new Promise(async function (resolve, reject) {

            try {

                const html = await axios.get('https://www.redcat.ca//');
                const $ = await cheerio.load(html.data);

                let data = [];

                $('a.ticket').each(function (index, element) {


                    // try to format band name
                    // TODO: clean this up
                    var band_name = $(element).find('h3').text().trim();
                    var band_name_reduced = "";
                    const escape_chars = ['(', '-', '&', "vs", "ticket"];

                    for (let i = 0; i < escape_chars.length; i++){

                        if (band_name.includes(escape_chars[i])){
                            band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
                            break;
                        }
                        else{
                            band_name_reduced = band_name;
                        }
                        
                    }

                    data.push(
                        {
                            ticket_band: band_name_reduced,
                            ticket_date: $(element).find('p.ticket__venue').text().trim(),
                            ticket_price: $(element).find('p.ticket__price').text().trim(),
                        }
                    );
                });

                //console.log(data);
                resolve(data);
                console.log("Successfully extracted Red Cat Records");

            }
            catch {

                reject("Error: Extracted Red Cat Records Failure");
                console.log("Error: Extracted Red Cat Records Failure");

            }

        });
    }
}
