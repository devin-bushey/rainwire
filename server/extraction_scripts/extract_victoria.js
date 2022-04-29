const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {

    extract: function () {

        return new Promise(async function (resolve, reject) {

            try {

                const html = await axios.get('https://victoriamusicscene.com/concerts/');
                const $ = await cheerio.load(html.data);

                let data = [];        

                $('div.tribe-events-calendar-list__event-details.tribe-common-g-col').each(function (index, element) {

                    var band_name = $(element).find('a').text().trim();
                    var band_name_reduced = "";
                    const escape_chars = ['w/', '&', '-', "vs", " at "];
                    for (let i = 0; i < escape_chars.length; i++){

                        if (band_name.includes(escape_chars[i])){
                            band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
                            break;
                        }
                        else{
                            band_name_reduced = band_name;
                        }
                        
                    }
                    //console.log(band_name_reduced);

                    var venue = band_name.substring(band_name.indexOf(' at ')).trim();
                    venue = venue.substring(3);
                    //console.log(venue);

                    var date = $(element).find('span.tribe-event-date-start').text().trim();
                    var date_reduced = date.substring(0, date.indexOf('@')).trim();
                    //console.log(date_reduced);

                    var price = $(element).find('span.tribe-events-c-small-cta__price').text().trim();
                    var price_reduced = price;
                    if (price.includes(' ')){
                        price_reduced = price.substring(0, price.indexOf(' ')).trim();
                    }
                    //console.log(price_reduced);

                    data.push(
                        {
                            ticket_band: band_name_reduced,
                            ticket_date: date_reduced + ' @ ' + venue,
                            ticket_price: price_reduced,
                        }
                    );


                });

                //console.log(data);
                resolve(data);
                console.log("Successfully extracted https://victoriamusicscene.com/concerts/");

            }
            catch {

                reject("Error: Extracted https://victoriamusicscene.com/concerts/ Failure");
                console.log("Error: Extracted https://victoriamusicscene.com/concerts/ Failure");

            }

        });
    }
}
