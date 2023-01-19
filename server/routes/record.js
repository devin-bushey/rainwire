const express = require("express");
const { manualRun } = require("../db/addSpotifyDataToCollection");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const { extractTickets, extract } = require("../extract_tickets");

recordRoutes.route("/ottawa").get(function (req, res) {

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("db_ottawa_spotify")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/vancouver").get(function (req, res) {

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("db_vancouver_spotify")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/victoria").get(function (req, res) {

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("db_victoria_spotify")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/webscrape").get(async function (req, res) {

  const date = getTodaysDate();

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("db_victoria_spotify")
    .drop()
    .then(function () {
      console.log("db_victoria_spotify DROPPED");
      // success
    }).catch(function () {
      console.log("ERROR db_victoria_spotify NOT DROPPED");
      // error handling
    })
    .then(function () {
      db_connect
        .collection("db_victoria_" + date)
        .drop()
        .then(function () {
          console.log("db_victoria_" + date + " DROPPED");
          // success
        }).catch(function () {
          console.log("ERROR db_victoria_" + date + " NOT DROPPED");
          // error handling
        })
    })
    .then(function () {
      extract();
    });

  res.json("Web Scraping Done!");

});

recordRoutes.route("/addspotify").get(async function (req, res) {

  const date = getTodaysDate();

  manualRun("db_victoria_" + date);

  res.json("Added Spotify Data!");

});

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return mm + '-' + dd + '-' + yyyy;
}

module.exports = recordRoutes;