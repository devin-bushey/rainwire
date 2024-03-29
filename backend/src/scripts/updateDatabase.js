
// USAGE:


// node ./backend/src/scripts/updateDatabase.js 'test' 'mongodb://root:example@localhost:27017/' d64eed8d-4612-4ee4-9529-46dc35e8083d BQA8Ej4jFrXV4tCuL0duhmKUCJdzktpvRVckTv1_04VIH0GoXtFCDD4pVjWlfHc1VA3dY-hGzuoBaJHyDgUK75MvxZ7iBarQEnUYqUFJL1bryqfbr96qaSEw6URffOX8JIXsamVo1edAHCpHBLdabNAoop7-9gAQ8AuyWelg5rqfb_bFJa8Y5LTu6a591GGeEep1H7BY8zYMkDl-BZpsuinsX53SyrOSR7HPSw


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

          // TODO: OLD
          const concertObject = {
            artist: spotifyResponse.data.tracks[0].album.artists[0].name,
            ticket_date: `${event.endDate} at ${event.location.name}`,
            venue: event.location.name,
            date: event.endDate,
            band_id: spotifyId,
            sp_band_name: '',
            link: `https://open.spotify.com/artist/${spotifyId}`,
            uri: `spotify:artist:${spotifyId}`,
            albumArtUrl: spotifyResponse.data.tracks[0].album.images[1].url,
            topTrackURIs: topTracks.map(track => track.uri)
          };
          concertObject.sp_band_name = concertObject.artist;

          // NEW DATAMODEL

          // const concertObject = {
          //   artist: {
          //     id: spotifyId,
          //     name: spotifyResponse.data.tracks[0].album.artists[0].name,
          //     topTracks: topTracks.map(track => track.uri),
          //     uri: `spotify:artist:${spotifyId}`,
          //     albumArtUrl: spotifyResponse.data.tracks[0].album.images[1].url,
          //     link: `https://open.spotify.com/artist/${spotifyId}`
          //   },
          //   date: event.endDate,
          //   venue: event.location.name,
          // };

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
      // Upsert operation based on the artist's Spotify ID
      await collection.updateOne(
        { band_id: concert.band_id },
        { $setOnInsert: concert },
        { upsert: true }
      );
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
