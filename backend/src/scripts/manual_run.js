const https = require('https');
const { MongoClient } = require('mongodb');

// Check if all required arguments are provided
if (process.argv.length !== 8) {
  console.error('Usage: node manual_run.js <Spotify Artist ID> <Date> <Venue> <DB Url> <DB Collection> <Bearer Token>');
  process.exit(1);
}

const artistId = process.argv[2];
const date = process.argv[3];
const venue = process.argv[4];
const databaseUrl = process.argv[5];
const collectionName = process.argv[6];
const bearerToken = process.argv[7];

const concertObject = {
  artist: '',
  ticket_date: `${date} at ${venue}`,
  venue,
  date,
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
    Authorization: `Bearer ${bearerToken}`,
  },
};

const addToMongoDb = async (_concertObject) => {
  // Connect to MongoDB and save the concertObject to the specified collection
  const client = new MongoClient(databaseUrl);
  try {
    await client.connect();
    console.log('Succesfully connected to ', databaseUrl);
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
  } finally {
    // Close the MongoDB client connection
    await client.close();
    process.exit(2);
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const topTracks = JSON.parse(data).tracks;
    topTracks.forEach((track) => {
      concertObject.topTrackURIs.push(track.uri);
    });

    const name = JSON.parse(data).tracks[0].album.artists[0].name;
    concertObject.artist = name;
    concertObject.sp_band_name = name;

    const albumArt = JSON.parse(data).tracks[0].album.images[1].url;
    concertObject.albumArtUrl = albumArt;

    // Print the concert object as JSON
    console.log(JSON.stringify(concertObject, null, 2));

    addToMongoDb(concertObject);

    // You can also save it to a file if needed
    // fs.writeFileSync('concertObject.json', JSON.stringify(concertObject, null, 2));
  });
});

req.on('error', (error) => {
  console.error('Error making Spotify API request:', error);
});

req.end();
