require('dotenv').config({ path: '../config.env' });
import axios from 'axios';

export const updateCollectionWithSpotify = async (collection_name: string, db_connect: any) => {
  db_connect
    .collection(collection_name)
    .find({})
    .toArray(async function (err: any, result: any) {
      if (err) throw err;
      const linked_data = await addSpotifyData(result);
      await createNewCollection(linked_data, collection_name, db_connect);
    });
};

const createNewCollection = async (linked_data: any, collection_name: string, db_connect: any) => {
  let name = collection_name.substring(0, collection_name.length - 11) + '_spotify';

  await db_connect.createCollection(name, (err: any, result: any) => {
    //console.log('createCollection', err, result);
    //if (err) throw err;
    console.log(name + ' created!');
  });

  await db_connect.collection(name).insertMany(linked_data, (err: any, res: any) => {
    //console.log('collection', err, res);
    //if (err) throw err;
    console.log('Successfully added ' + res.insertedCount + ' records to ' + name);
  });
};

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
          element.sp_band_name = res.data.artists.items[0].name;
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
