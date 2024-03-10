const cheerio = require('cheerio');
const axios = require('axios');
const { MongoClient } = require('mongodb');

// USAGE:

// node ./backend/src/scripts/webscrape.js <city or festival>
// EXAMPLE: node ./backend/src/scripts/webscrape.js vancouver

// This script should not be considered the source of truth and should be deleted
// This script is a copy of the following:
// \backend\src\database\addSimpleDataToCollection.ts
// \backend\src\scripts\webscraping\extract_tickets.ts


const databaseUrl = 'mongodb://root:example@localhost:27017/';

const city = process.argv[2];
// Check if all required arguments are provided
if (process.argv.length !== 3) {
  console.error('Usage: node webscrape.js <city or festival>');
  process.exit(1);
}

(async () => {
  console.log('Starting Web Scraping for ' + city);
  const client = new MongoClient(databaseUrl);
  try {
    await client.connect();
    console.log("Succesfully connected to ", databaseUrl)
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
  const db = client.db('RecordShop');
  try {
    await extract(city, db);
  } catch (err) {
    console.log('Error /extract: ', err);
    process.exit(-2);
  }

  process.exit(2);
})();


const extract = async (location, db) => {

  const collectionName = location + '_simple';
  let tickets;

  console.log("Extracting tickets ....")

  switch (location) {
    case 'victoria':
      tickets = await extractVictoria();
      break;

    case 'vancouver':
      tickets = await extractVancouver();
      break;

    default:
      console.log('Whoops! only victoria or vancouver are currently being supported')
      process.exit(-3)

  }

  if (tickets.length > 0) console.log(tickets.length, " Tickets extracted!")

  console.log("Creating collection .... ")

  try {
    await db.createCollection(collectionName);
    console.log(collectionName + ' created!');
  } catch (err) {
    console.log("**** Error: ", err)
    process.exit(-4)
  }

  try {
    await db.collection(collectionName).insertMany(tickets)
    console.log('Successfully added records to ' + collectionName);
  } catch (err) {
    console.log("**** Error: ", err)
  }

};

const extractVictoria = async () => {
  let tickets = [];

  const tickets_vic_songkick_1 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27399-canada-victoria?page=1#metro-area-calendar',
  ); //page one of songkick
  const tickets_vic_songkick_2 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27399-canada-victoria?page=2#metro-area-calendar',
  ); //page two of songkick
  const tickets_vic_songkick_3 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27399-canada-victoria?page=3#metro-area-calendar',
  ); //page three of songkick

  tickets_vic_songkick_1.forEach(function (obj) {
    tickets.push(obj);
  });
  tickets_vic_songkick_2.forEach(function (obj) {
    tickets.push(obj);
  });
  tickets_vic_songkick_3.forEach(function (obj) {
    tickets.push(obj);
  });

  return tickets;
};

const extractVancouver = async () => {
  let tickets = [];

  const tickets_van_songkick_1 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27398-canada-vancouver?page=1#metro-area-calendar',
  ); //page one of songkick
  const tickets_van_songkick_2 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27398-canada-vancouver?page=2#metro-area-calendar',
  ); //page two of songkick
  const tickets_van_songkick_3 = await extract_songkick(
    'https://www.songkick.com/metro-areas/27398-canada-vancouver?page=3#metro-area-calendar',
  ); //page three of songkick

  // consolidate tickets
  tickets_van_songkick_1.forEach(function (obj) {
    tickets.push(obj);
  });
  tickets_van_songkick_2.forEach(function (obj) {
    tickets.push(obj);
  });
  tickets_van_songkick_3.forEach(function (obj) {
    tickets.push(obj);
  });

  return tickets;
};

const extract_songkick = async (url) => {
  console.log('Extracting song kick ' + url);
  let data = [];

  await axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);

      $('.event-listings-element').each(function (index, element) {
        var band_name = $(element).find('p.artists').text().trim();
        var band_name_reduced = '';
        const escape_chars = ['\n'];
        for (let i = 0; i < escape_chars.length; i++) {
          if (band_name.includes(escape_chars[i])) {
            band_name_reduced = band_name.substring(0, band_name.indexOf(escape_chars[i])).trim();
            break;
          } else {
            band_name_reduced = band_name;
          }
        }

        var dateString = $(element).find('time').attr('datetime');
        var date_reduced = dateString?.substring(0, 10);

        var venue = $(element).find('.venue-link').text().trim();

        data.push({
          artist: band_name_reduced,
          ticket_date: `${date_reduced} at ${venue}`,
          venue: venue,
          date: date_reduced,
          popularity: index,
        });
      });
      return data;
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      console.log('Error extracting songkick');
    });

  return data;
};
