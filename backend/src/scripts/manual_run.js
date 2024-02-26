const fs = require('fs');
const https = require('https');

// Check if all required arguments are provided
if (process.argv.length !== 6) {
  console.error(
    'Usage: node createConcertObject.js <Spotify Artist ID> <Date> <Venue> <Bearer Token>',
  );
  process.exit(1);
}

const artistId = process.argv[2];
const date = process.argv[3];
const venue = process.argv[4];
const bearerToken = process.argv[5];

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

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('*****');
    console.log(data);
    console.log('*****');
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

    // You can also save it to a file if needed
    // fs.writeFileSync('concertObject.json', JSON.stringify(concertObject, null, 2));
  });
});

req.on('error', (error) => {
  console.error('Error making Spotify API request:', error);
});

req.end();
