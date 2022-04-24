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

const axios = require('axios');

const extract_ottawa = require('./extract_ottawa.js');
const extract_vancouver = require('./extract_vancouver.js');
const extract_victoria = require('./extract_victoria.js');
const extract_capitalBallroom = require('./extract_capitalBallroom.js');


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
  let tickets_ottawa_linked = await addSpotifyData(tickets_ottawa);

  let tickets_vancouver = await extract_vancouver.extract();
  let tickets_vancouver_linked = await addSpotifyData(tickets_vancouver);

  let tickets_victoria = await extract_victoria.extract();
  let tickets_victoria_linked = await addSpotifyData(tickets_victoria);

  let tickets_capitalBallroom = await extract_capitalBallroom.extract();
  let tickets_capitalBallroom_linked = await addSpotifyData(tickets_capitalBallroom);
  

  //await new Promise(r => setTimeout(r, 2000));

  let db_connect = dbo.getDb();

  

  // TODO: clean up this db stuff
  db_connect.listCollections({ name: "data_ottawa" })
    .next(function (err, collinfo) {

      if (collinfo) {

        
        db_connect.collection("data_ottawa").drop(function (err, delOK) {
          if (err) throw err;
          if (delOK) console.log(collinfo.name + " deleted");
          //db_connect.close();
        });

        db_connect.collection("data_ottawa").insertMany(tickets_ottawa_linked, function (err, res) {
          if (err) throw err;
          console.log("Successfully added " + res.insertedCount + " records to " + collinfo.name);
        });
        

      }


    });


  db_connect.listCollections({ name: "data_vancouver" })
    .next(function (err, collinfo) {

      //console.log(collName)
      if (collinfo) {

        db_connect.collection("data_vancouver").drop(function (err, delOK) {
          if (err) throw err;
          if (delOK) console.log(collinfo.name + " deleted");
          //db_connect.close();
        });
        

        
        db_connect.collection("data_vancouver").insertMany(tickets_vancouver_linked, function (err, res) {
          if (err) throw err;
          console.log("Successfully added " + res.insertedCount + " records to " + collinfo.name);
        });
    

      }


    });


    db_connect.listCollections({ name: "data_victoria" })
    .next(function (err, collinfo) {

      //console.log(collName)
      if (collinfo) {

        
        db_connect.collection("data_victoria").drop(function (err, delOK) {
          if (err) throw err;
          if (delOK) console.log(collinfo.name + " deleted");
          //db_connect.close();
        });
        

        
        db_connect.collection("data_victoria").insertMany(tickets_capitalBallroom_linked, function (err, res) {
          if (err) throw err;
          console.log("Successfully added " + res.insertedCount + " records to " + collinfo.name);
        });

        db_connect.collection("data_victoria").insertMany(tickets_victoria_linked, function (err, res) {
          if (err) throw err;
          console.log("Successfully added " + res.insertedCount + " records to " + collinfo.name);
        });
        

      }


    });

    

  /* db_connect.collection("data_ottawa").insertMany(tickets_ottawa_linked, function (err, res) {
    if (err) throw err;
    console.log(res);
  });

  db_connect.collection("data_vancouver").insertMany(tickets_vancouver_linked, function (err, res) {
    if (err) throw err;
    console.log(res);
  }); */

})();

async function getSpotifyAuth() {

  var client_id = process.env.SP_CLIENT_ID;
  var client_secret = process.env.SP_CLIENT_S;

  return await new Promise(function (resolve, reject) {

    axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      params: {
        "grant_type": 'client_credentials'
      }

    }).then(function (response) {

      resolve(response.data.access_token);

    }).catch(function (error) {
      console.log("Error: POST getAccessToken");
      console.log(error);
    });
  });

}

async function addSpotifyMainData(element, token) {

  await new Promise(function (resolve, reject) {
    axios({
      url: 'https://api.spotify.com/v1/search',
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + token,
      },
      params: {
        "q": element.ticket_band,
        "type": 'artist'
      }

    }).then(async function (res) {

      try {
        element.band_id = res.data.artists.items[0].id;
        element.link = res.data.artists.items[0].external_urls.spotify;
        element.uri = res.data.artists.items[0].uri;
        element.genres = res.data.artists.items[0].genres;
      }
      catch {

      }

      resolve();

    }).catch(function (error) {

      console.log(error.response);
    });
  });

}

async function addSpotifyData(data) {

  const token = await getSpotifyAuth();

  for (const element of data) {

    await addSpotifyMainData(element, token);

    await addSpotifyTopTracks(element, token);

  }

  return data;

}


async function addSpotifyTopTracks(element, token) {

  if (element.band_id) {

    await new Promise(function (resolve, reject) {
      axios({
        url: "https://api.spotify.com/v1/artists/" + element.band_id + "/top-tracks?market=CA",
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + token,
        }
      }).then(async function (res) {

        try {
          element.top_tracks = res.data.tracks;
        }
        catch {
          console.log("error at adding top tracks");
        }

        resolve();

      }).catch(function (error) {

        console.log(error);
      });
    });

  }

}
