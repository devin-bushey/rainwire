const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

const request = require('request');
const cheerio = require('cheerio');

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });

  console.log(`Server is running on port: ${port}`);

});


(async function () {

  let tickets = await extract_data();

  await new Promise(r => setTimeout(r, 2000));

  let db_connect = dbo.getDb();

  // comment out for testing
  /* db_connect.collection("test_db").insertMany(tickets, function (err, res) {
    if (err) throw err;
    console.log(res);
  }); */

})();


function extract_data() {

  return new Promise(function (resolve, reject) {
    request('http://www.vertigorecords.ca/showtickets/index.html', (error, response, html) => {
      if (!error && response.statusCode == 200) {

        console.log("[Extract Data from Vertigo Records]");

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

            ticketsString += '{ "ticket_month": "' + dateMonth + '" , "ticket_day": ' + dateDay + ' , "ticket_band": "' + bandName + '" , "ticket_price": "' + price + '" , "ticket_soldout": ' + isSoldOut + '},';

          }
        }

        ticketsString = ticketsString.substring(0, ticketsString.length - 1); // remove last comma
        ticketsString += ']';

        var ticketsJSON = JSON.parse(ticketsString);

        resolve(ticketsJSON);

      }
      else {
        console.log('error');
        reject("error");
        //console.log(response.statusCode);
      }
    })
  });
};

