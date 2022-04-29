require("dotenv").config({ path: "./config.env" });
const dbo = require("./db/conn");
const axios = require('axios');
const extract_ottawa = require('./extraction_scripts/extract_ottawa.js');
const extract_vancouver = require('./extraction_scripts/extract_vancouver.js');
const extract_victoria = require('./extraction_scripts/extract_victoria.js');
const extract_capitalBallroom = require('./extraction_scripts/extract_capitalBallroom.js');

const addSimpleDataToCollection = require("./db/addSimpleDataToCollection");
//const addSpotifyDataToCollection = require("./db/addSpotifyDataToCollection");

dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
    }
    else {
        extractTickets();
    }
});

async function extractTickets() {

    let date = getTodaysDate();
    let db_connect = dbo.getDb();

    let tickets_ottawa = await extract_ottawa.extract();
    let tickets_vancouver = await extract_vancouver.extract();
    let tickets_victoria = await extract_victoria.extract();
    let tickets_capitalBallroom = await extract_capitalBallroom.extract();

    addSimpleDataToCollection.createCollection(("db_ottawa" + "_" + date).toString(), tickets_ottawa, db_connect);
    addSimpleDataToCollection.createCollection(("db_vancouver" + "_" + date).toString(), tickets_vancouver, db_connect);
    addSimpleDataToCollection.createCollection(("db_victoria" + "_" + date).toString(), tickets_capitalBallroom, db_connect);

};

function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '-' + dd + '-' + yyyy;
}

