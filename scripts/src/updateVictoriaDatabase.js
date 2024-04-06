
// USAGE:

// node ./updateVictoriaDatabase.js {DB Url} {JamBase API} {Spotify Bearer Token}
// EXAMPLE: node ./updateVictoriaDatabase.js 'mongodb://root:example@localhost:27017/' {JamBase API} BQBmvVscfEDlR_M-vokiUyu3k2VGyQzKp49hi3Uo-IkqqheATjHbGPHUb5rASOyBf2grQqm67hb3akKe4K4zlmgk3jytcU7zu43JUozrAxez7rB07A6qZS6xra_kZte527lDOTctkktjTj_4rHWYDOacnpIp8KTlB37BOcvWwBhjex9YrBKsm8PbP18RWdhDtTo1l4TaH8l6GU4R6el8-53V7QVVCKoZEQCeUA

// # Get the Bearer token by logging into your spotify account through record shop, 
// # then get the token from Dev tools -> Application tab -> local storage

// node ./backend/src/scripts/updateVictoriaDatabase.js 'mongodb://root:example@localhost:27017/' {JamBase API} BQCMNUZcgv2-CSZFaAkdUb5y6cqJnEbFIxPfSsR-cKDiKPZzdGt4I3dTPaGFTJMCHpXQ53UiczHtY3WtYKObh4ANsLITMeq-6x769HSko5LO3sAQLvXdU2NgL0YyPofalNvWp2RO4DewPv7UueXcxF_5q65h1CQ6bGpQcuxItk4Ufgy9InG_sqgcFJv0V_MtZbR764rrRQuuTVBzX8Ij5DzLaq629WQfx-q3mQ

const axios = require('axios');
const { MongoClient } = require('mongodb');

const databaseUrl = process.argv[2];
const apiKey = process.argv[3];
const bearerToken = process.argv[4];

const optionsJamBase = {
  method: 'GET',
  url: 'https://www.jambase.com/jb-api/v1/events',
  params: {
    eventType: 'concerts',
    geoCityId: 'jambase:382342',
    geoRadiusAmount: '100',
    apikey: apiKey,
    expandExternalIdentifiers: true
  },
  headers: { Accept: 'application/json' }
};

async function getConcertData() {
  try {
    console.log("Calling JamBase ...");
    const response = await axios(optionsJamBase);
    const data = response.data;
    const concertData = [];
    const existingArtists = new Set(); // To store existing artist IDs
    for (const event of data.events) {
      for (const performer of event.performer) {
        let spotifyId = null;
        for (const externalIdentifier of performer["x-externalIdentifiers"]) {
          if (externalIdentifier.source === "spotify") {
            spotifyId = externalIdentifier.identifier[0];
          }
        }
        if (spotifyId && !existingArtists.has(spotifyId)) { // Check for duplicate artist
          existingArtists.add(spotifyId);
          const optionsSpotify = {
            method: 'GET',
            url: `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks`,
            headers: { Accept: 'application/json', 'Authorization': `Bearer ${bearerToken}` }
          };
          const spotifyResponse = await axios(optionsSpotify);
          const topTracks = spotifyResponse.data.tracks;
          const concertObject = {
            artist: {
              id: spotifyId,
              name: spotifyResponse.data.tracks[0].album.artists[0].name,
              topTracks: topTracks.map(track => track.uri),
              uri: `spotify:artist:${spotifyId}`,
              albumArtUrl: spotifyResponse.data.tracks[0].album.images[1].url,
              link: `https://open.spotify.com/artist/${spotifyId}`
            },
            date: event.endDate,
            venue: event.location.name,
          };
          concertData.push(concertObject);
        }
      }
    }
    console.log(`Got ${concertData.length} concerts. Yew!`);
    return concertData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const updateMongoDb = async () => {
  const concertData = await getConcertData();

  // Connect to MongoDB and update the existing collection
  const client = new MongoClient(databaseUrl);
  try {
    console.log(`Connecting to your database ..`);
    await client.connect();
    console.log("Successfully connected to ", databaseUrl);
  } catch (e) {
    console.error(e);
    return;
  }
  const db = client.db('RecordShop');

  try {
    const collection = db.collection('victoria');

    for (const concert of concertData) {
      // Check if the concert already exists in the database
      const existingConcert = await collection.findOne({ 'artist.id': concert.artist.id });
      if (!existingConcert) {
        // Insert the concert if it doesn't exist
        await collection.insertOne(concert);
        console.log(`Concert for ${concert.artist.name} on ${concert.date} added to the database`);
      } else {
        console.log(`Concert for ${concert.artist.name} on ${concert.date} already exists in the database`);
      }
    }

    console.log(`Documents were updated/inserted`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

updateMongoDb();
