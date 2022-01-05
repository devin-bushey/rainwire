const request = require('request');
const cheerio = require('cheerio');

//import request from 'request';
//import cheerio from 'cheerio';

module.exports = {

   extract: function () {

      return new Promise(function (resolve, reject) {
         request('http://www.vertigorecords.ca/showtickets/index.html', (error, response, html) => {
            if (!error && response.statusCode == 200) {

               const $ = cheerio.load(html);

               const ticketsRawData = $('#contentarea');

               const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

               //var ticketsString = '{ "tickets":[ ';
               var ticketsString = "[";

               var lines = ticketsRawData.text().split('\n');
               for (var i = 0; i < lines.length; i++) {

                  if (months.some(month => lines[i].substring(0, 3).includes(month)) && lines[i].length > 10) {
                     //console.log(lines[i]);
                     var dateMonth = lines[i].substring(0, 3).trim();
                     var dateDay = lines[i].substring(4, 6).trim();
                     var date = dateMonth + " " + dateDay;
                     var bandName = lines[i].substring(lines[i].indexOf(':') + 2, lines[i].indexOf('$')).trim();
                     var price = lines[i].substring(lines[i].indexOf('$')).trim();
                     var isSoldOut = false;

                     if (price.includes('==')) {
                        price = lines[i].substring(lines[i].indexOf('$'), lines[i].indexOf('=')).trim();
                        isSoldOut = true;
                     }

                     if (price.includes('(')) {
                        price = lines[i].substring(lines[i].indexOf('$'), lines[i].indexOf('(')).trim();
                     }

                     //console.log(dateMonth + ", " + dateDay + ", " + bandName + ", " + price + ", " + isSoldOut);

                     ticketsString += '{ "ticket_month": "' + dateMonth + '" , "ticket_day": ' + dateDay + ' , "ticket_date": "' + date + '" , "ticket_band": "' + bandName + '" , "ticket_price": "' + price + '" , "ticket_soldout": ' + isSoldOut + '},';

                  }
               }

               ticketsString = ticketsString.substring(0, ticketsString.length - 1); // remove last comma
               ticketsString += ']';

               var ticketsJSON = JSON.parse(ticketsString);

               

               resolve(ticketsJSON);

               console.log("Successfully extracted Vertigo Records");

            }
            else {
               console.log("Error : Extracted Vertigo Records Failure");
               reject("Error : Extracted Vertigo Records Failure");
               //console.log(response.statusCode);
            }
         })
      });
   }
}