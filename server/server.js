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

const extract_ottawa = require('./extract_ottawa.js');
const extract_vancouver = require('./extract_vancouver.js');

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });

  console.log(`Server is running on port: ${port}`);

});


(async function () {

  // TODO: add a while true loop and update db ~ once a day

  let tickets_ottawa = await extract_ottawa.extract();
  let tickets_ottawa_linked = await addSpotifyLink(tickets_ottawa);

  let tickets_vancouver = await extract_vancouver.extract();
  let tickets_vancouver_linked = await addSpotifyLink(tickets_vancouver);

  await new Promise(r => setTimeout(r, 2000));

  let db_connect = dbo.getDb();

  // comment out for testing  
/*   db_connect.collection("data_ottawa").insertMany(tickets_ottawa_linked, function (err, res) {
    if (err) throw err;
    console.log(res);
  });

  db_connect.collection("data_vancouver").insertMany(tickets_vancouver_linked, function (err, res) {
    if (err) throw err;
    console.log(res);
  }); */

})();

async function addSpotifyLink(data) {

  var client_id = process.env.SP_CLIENT_ID;
  var client_secret = process.env.SP_CLIENT_S;

  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
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
