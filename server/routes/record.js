const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const request = require('request');
const cheerio = require('cheerio');

// This section will help you get a list of all the records.
recordRoutes.route("/ottawa").get(function (req, res) {

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("data_ottawa")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a list of all the records.
recordRoutes.route("/vancouver").get(function (req, res) {

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("data_vancouver")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


module.exports = recordRoutes;