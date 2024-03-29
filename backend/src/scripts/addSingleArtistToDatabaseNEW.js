const https = require('https');
const { MongoClient } = require('mongodb');

// USAGE:

// node ./backend/src/scripts/addSingleArtistToDatabase.js {Spotify Id} {Date} {Venue} <DB Url> <DB Collection> {Bearer Token}
// EXAMPLE: node ./backend/src/scripts/addSingleArtistToDatabase.js 1qPcb4gGRO6ZsefrOWsh8f 2024-06-30 "Laketown Ranch" DB 'laketownShakedown_2024' BQCwWoPukbUZ4hXar1QYzpgQ09dUqXasvMBwtTvycWqFFner0JpgwDQW8LWK5g25T2SfVxb2vCNCvcRd9asUQiFwSg1KK_04OMqCaYY_GdtzozfaJId5C2hnqw7jhlson1e3G21UJrDpZc7lVqo7e2v9h3tL1BD-Zo-Gm89M-1QbcKotveBllHKsEXJ7_aE4OzQpEiIjzBXCaTX1TTGnpxKbdMdpsmkLwK6VKg
// # Get the Bearer token by logging into your spotify account through record shop, 
// # then get the token from Dev tools -> Application tab -> local storage

// # Get the spotify Id from opening up spotify in your browser (easiest to click an artist from record shop)
// # then search for an artist, then the Id is last in the url (Example: https://open.spotify.com/artist/79JJCxCCfJ8HufX6w8q2k4)

// # This script gets the spotify info then updates the provided database


// Check if all required arguments are provided
if (process.argv.length !== 9) {
  console.error('Usage: node addSingleArtistToDatabase.js <Spotify Artist ID> <Date> <Popularity> <Venue> <DB Url> <DB Collection> <Bearer Token>');
  process.exit(1);
}

const artistId = process.argv[2];
const date = process.argv[3];
const popularity = process.argv[4];
const venue = process.argv[5];
const databaseUrl = process.argv[6];
const collectionName = process.argv[7];
const bearerToken = process.argv[8];

const concertObject = {
  artist: {
    id: artistId,
    name: "",
    topTracks: [],
    uri: `spotify:artist:${artistId}`,
    albumArtUrl: "",
    link: `https://open.spotify.com/artist/${artistId}`,
  },
  date,
  venue,
  popularity,


  ticket_date: `${date} at ${venue}`,
  band_id: artistId,
  sp_band_name: '',
  link: `https://open.spotify.com/artist/${artistId}`,
  uri: `spotify:artist:${artistId}`,
  albumArtUrl: '',
  topTrackURIs: [],
};

// Make a GET request to Spotify API to get top tracks
const options = {
  hostname: 'api.spotify.com',
  path: `/v1/artists/${artistId}/top-tracks?market=ca`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
  },
};

const addToMongoDb = async (_concertObject) => {
  // Connect to MongoDB and save the concertObject to the specified collection
  const client = new MongoClient(databaseUrl);
  try {
    await client.connect();
    console.log("Succesfully connected to ", databaseUrl)
  } catch (e) {
    console.error(e);
  }
  const db = client.db('RecordShop');

  try {
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(_concertObject);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch (e) {
    console.error(e);
  }
  finally {
    // Close the MongoDB client connection
    await client.close();
    process.exit(2);
  }


}

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {


    const topTracks = JSON.parse(data).tracks;
    topTracks.forEach((track) => {
      concertObject.topTrackURIs.push(track.uri);
      concertObject.artist.topTracks.push(track.uri); // NEW
    });

    const name = JSON.parse(data).tracks[0].album.artists[0].name;
    concertObject.artist.name = name; // NEW
    concertObject.sp_band_name = name;

    const albumArt = JSON.parse(data).tracks[0].album.images[1].url;
    concertObject.artist.albumArtUrl = albumArt; // NEW
    concertObject.albumArtUrl = albumArt;

    // Print the concert object as JSON
    console.log(JSON.stringify(concertObject, null, 2));

    addToMongoDb(concertObject)

    // You can also save it to a file if needed
    // fs.writeFileSync('concertObject.json', JSON.stringify(concertObject, null, 2));
  });
});

req.on('error', (error) => {
  console.error('Error making Spotify API request:', error);
});

req.end();
