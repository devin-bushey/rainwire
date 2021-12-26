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

recordRoutes.route("/update").post(function (req, response) {
  console.log("Testing Update");

  console.log(req.body);
  
  let db_connect = dbo.getDb();
  let myobj = {
    ticket_month: "Test23",
    ticket_day: "Test23",
    ticket_band: "Test13",
  };
  console.log(myobj);

  db_connect.collection("tickets_test0").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });

});


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {

  let db_connect = dbo.getDb("RecordShop");

  db_connect
    .collection("test_db")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

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

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("tickets")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    ticket_month: req.body.ticket_month,
    ticket_day: req.body.ticket_day,
    ticket_band: req.body.ticket_band,
  };
  db_connect.collection("tickets").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      ticket_month: req.body.ticket_month,
      ticket_day: req.body.ticket_day,
      ticket_band: req.body.ticket_band,
    },
  };
  db_connect
    .collection("tickets")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("tickets").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.status(obj);
  });
});

module.exports = recordRoutes;