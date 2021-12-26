const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {

    extract: function () {

        return new Promise(async function (resolve, reject) {

            try {

                const html = await axios.get('https://www.redcat.ca//');
                const $ = await cheerio.load(html.data);

                let data = [];

                $('div[class=ticket]').each(function (index, element) {
                    data.push(
                        {
                            ticket_band: $(element).find('h3').text().trim(),
                            ticket_date: $(element).find('p.ticket__venue').text().trim(),
                            ticket_price: $(element).find('p.ticket__price').text().trim(),
                        }
                    );
                });

                //console.log(data);
                resolve(data);
                console.log("Extracted Red Cat Records Success");

            }
            catch {

                reject("Error: Extracted Red Cat Records Failure");
                console.log("Error: Extracted Red Cat Records Failure");

            }

        });
    }
}
