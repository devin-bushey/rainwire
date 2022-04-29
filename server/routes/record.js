const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

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


module.exports = recordRoutes;