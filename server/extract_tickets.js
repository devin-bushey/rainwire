require("dotenv").config({ path: "./config.env" });
const dbo = require("./db/conn");
const axios = require('axios');
const _ = require('lodash');

const extract_ottawa = require('./extraction_scripts/extract_ottawa.js');
const extract_vancouver = require('./extraction_scripts/extract_vancouver.js');
const extract_victoria = require('./extraction_scripts/extract_victoria.js');
const extract_capitalBallroom = require('./extraction_scripts/extract_capitalBallroom.js');
const extract_vic_songkick_1 = require('./extraction_scripts/extract_vic_songkick.js');
const extract_vic_songkick_2 = require('./extraction_scripts/extract_vic_songkick_page2.js');

const addSimpleDataToCollection = require("./db/addSimpleDataToCollection");
const addSpotifyDataToCollection = require("./db/addSpotifyDataToCollection");

module.exports = {

    extract:  function() {

        dbo.connectToServer(function (err) {
            if (err) {
                console.error(err);
            }
            else {
                extractTickets();
            }
        });
    
    }
    

} 

async function extractTickets() {

    let date = getTodaysDate();
    let db_connect = dbo.getDb();

    //
    // ***** VICTORIA *****
    //

    // extract from record shop website
    let tickets_victoria = await extract_victoria.extract();
    let tickets_capitalBallroom = await extract_capitalBallroom.extract();
    let tickets_vic_songkick_1 = await extract_vic_songkick_1.extract();  //page one of songkick
    let tickets_vic_songkick_2 = await extract_vic_songkick_2.extract();  //page two of songkick

    // consolidate tickets
    tickets_capitalBallroom.forEach(function(obj) { tickets_victoria.push(obj); });
    tickets_vic_songkick_1.forEach(function(obj) { tickets_victoria.push(obj); });
    tickets_vic_songkick_2.forEach(function(obj) { tickets_victoria.push(obj); });

    // sort by date
    tickets_victoria.sort(sortByDate);

    // remove duplicates
    tickets_victoria = removeDuplicateBands(tickets_victoria);

    // create simple data collection
    addSimpleDataToCollection.createCollection(("db_victoria" + "_" + date).toString(), tickets_victoria, db_connect);

    // run the following command to add Spotify data
    // node -e 'require("./addSpotifyDataToCollection").manualRun("db_victoria_01-19-2023")'

    //addSpotifyDataToCollection.manualRun(("db_victoria" + "_" + date).toString());

    //
    // ***** VANCOUVER & OTTAWA *****
    //

    //let tickets_ottawa = await extract_ottawa.extract();
    //let tickets_vancouver = await extract_vancouver.extract();

    //addSimpleDataToCollection.createCollection(("db_ottawa" + "_" + date).toString(), tickets_ottawa, db_connect);
    //addSimpleDataToCollection.createCollection(("db_vancouver" + "_" + date).toString(), tickets_vancouver, db_connect);

};

function sortByDate(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function removeDuplicateBands(arr) {
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm.ticket_band, itm2.ticket_band)) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
}

function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '-' + dd + '-' + yyyy;
}

