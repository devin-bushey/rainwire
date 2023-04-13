require('dotenv').config({ path: '../config.env' });
import dbo from './conn';
import axios from 'axios';

// used to run script manually
// from commandline, enter the following:
// node -e 'require("./addSpotifyDataToCollection").manualRun("collection_name")'
// example:
// node -e 'require("./addSpotifyDataToCollection").manualRun("db_victoria_01-16-2023")'
export const manualRun = (collection_name: string) => {
  dbo.connectToServer(async function (err: any) {
    if (err) {
      console.error(err);
    } else {
      let db_connect = dbo.getDb();
      console.log('Starting to add Spotify data ...');
      updateCollectionWithSpotify(collection_name.toString(), db_connect);
    }
  });
};

export async function updateCollectionWithSpotify(collection_name: string, db_connect: any) {
  db_connect
    .collection(collection_name)
    .find({})
    .toArray(async function (err: any, result: any) {
      if (err) throw err;
      var linked_data = await addSpotifyData(result);
      await createNewCollection(linked_data, collection_name, db_connect);
    });
}

async function createNewCollection(linked_data: any, collection_name: string, db_connect: any) {
  let name = collection_name.substring(0, collection_name.length - 11) + '_spotify';
  //let name = "db_victoria" + "_" + "spotify";

  db_connect.createCollection(name, function (err: any, res: any) {
    if (err) throw err;
    console.log(name + ' created!');
  });

  db_connect.collection(name).insertMany(linked_data, function (err: any, res: any) {
    if (err) throw err;
    console.log('Successfully added ' + res.insertedCount + ' records to ' + name);
    console.log('... Complete!');
  });
}

async function getSpotifyAuth() {
  var client_id = process.env.SP_CLIENT_ID;
  var client_secret = process.env.SP_CLIENT_S;

  return await new Promise(function (resolve, reject) {
    axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      params: {
        grant_type: 'client_credentials',
      },
    })
      .then(function (response) {
        resolve(response.data.access_token);
      })
      .catch(function (error) {
        console.log('Error: POST getAccessToken');
        console.log(error);
      });
  });
}

async function addSpotifyMainData(element: any, token: any) {
  await new Promise<void>(function (resolve, reject) {
    axios({
      url: 'https://api.spotify.com/v1/search',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: {
        q: element.ticket_band,
        type: 'artist',
      },
    })
      .then(async function (res) {
        try {
          element.band_id = res.data.artists.items[0].id;
          element.link = res.data.artists.items[0].external_urls.spotify;
          element.uri = res.data.artists.items[0].uri;
          element.genres = res.data.artists.items[0].genres;
        } catch {}

        resolve();
      })
      .catch(function (error) {
        console.log(error.response);
      });
  });
}

async function addSpotifyData(data: any) {
  const token = await getSpotifyAuth();

  for (const element of data) {
    await addSpotifyMainData(element, token);

    await addSpotifyTopTracks(element, token);
  }
  return data;
}

async function addSpotifyTopTracks(element: any, token: any) {
  if (element.band_id) {
    await new Promise<void>(function (resolve, reject) {
      axios({
        url: 'https://api.spotify.com/v1/artists/' + element.band_id + '/top-tracks?market=CA',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then(async function (res) {
          try {
            element.top_tracks = res.data.tracks;
          } catch {
            console.log('error at adding top tracks');
          }

          resolve();
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }
}
