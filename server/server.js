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
const axios = require('axios');

var _token;

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
  let ticketsLinked = await addSpotifyLink(tickets);

  // comment out for testing
  db_connect.collection("test_db").insertMany(ticketsLinked, function (err, res) {
    if (err) throw err;
    console.log(res);
  });


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




async function addSpotifyLink(data) {

  var client_id = '276aafa1475e4e5883df3bdf2899fc3a'; // Your client id
  var client_secret = '4cbc7336bd9b481e804c516926f57126'; // Your secret

  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  var getAccessToken = await new Promise(function (resolve, reject) {
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/users/n54pdoqawgph9ftwztxe6k77a',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, function (error, response, body) {
          //console.log(body);
          //console.log(token);
          resolve(token);

        });
      }
    });
  });

  for (const element of data) {

    await new Promise(function (resolve, reject) {
      axios({
        url: 'https://api.spotify.com/v1/search',
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + getAccessToken,
        },
        params: {
          "q": element.ticket_band,
          "type": 'artist'
        }

      }).then(function (res) {

        //console.log(res.data.artists.items[0].external_urls.spotify);
        var ret;
        try {
          ret = res.data.artists.items[0].external_urls.spotify;
        }
        catch {
          ret = " ";
        }

        element.link = ret;
        resolve(ret);

      }).catch(function (error) {

        console.log("error");
      });

    });

  }

  return data;

}
