
// USAGE:


// node ./backend/src/scripts/updateDatabase.js 'victoria_2024' 'mongodb://root:example@localhost:27017/' d64eed8d-4612-4ee4-9529-46dc35e8083d BQDCDsYASOM7-38MqPK8z3uPzuWbhqq_1YPG6W8OfaxGk3S6y1G6xRJEzKBTfimB_YUJdvKi0sn8C7zVa9BYy_8YLqjLKGwaOIxiV66T2lwoE3_k_xV61IlyT-kFSbJATcRI8-4pqJT77fFQgPto4uBgJGPcm8IrfR7qKv48zgzZoxO1pa80GzeWFXPtSiHYgq_u7wEgysh2TBFU3dtUcvuxfLrDVFyAoWNE9w

const axios = require('axios');
const { MongoClient } = require('mongodb');

const collectionName = process.argv[2];
const databaseUrl = process.argv[3];
const apiKey = process.argv[4];
const bearerToken = process.argv[5];

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
    const collection = db.collection(collectionName);
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
    // Close the MongoDB client connection
    await client.close();
  }
}

updateMongoDb();
