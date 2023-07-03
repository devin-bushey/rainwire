require('dotenv').config({ path: '../config.env' });
import axios from 'axios';
import _ from 'lodash';
import { getSpotifyAuth } from '../helpers/getSpotifyAuth';
import { removeDuplicateArtists } from '../helpers/removeDuplicateArtists';

export const updateCollectionWithSpotify = async (collection_name: string, db_connect: any) => {
  db_connect
    .collection(collection_name + '_simple')
    .find({})
    .toArray(async function (err: any, result: any) {
      if (err) throw err;
      const linked_data = await addSpotifyData(result);
      await createNewCollection(linked_data, collection_name, db_connect);
    });
};

async function addSpotifyData(data: any) {
  const token = await getSpotifyAuth();

  for (const element of data) {
    await addSpotifyMainData(element, token);

    await addSpotifyTopTracks(element, token);
  }
  return data;
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
        q: element.artist,
        type: 'artist',
      },
    })
      .then(async function (res) {
        try {
          element.band_id = res.data.artists.items[0].id;
          element.sp_band_name = res.data.artists.items[0].name;
          element.link = res.data.artists.items[0].external_urls.spotify;
          element.uri = res.data.artists.items[0].uri;
          //element.genres = res.data.artists.items[0].genres;
        } catch {}

        resolve();
      })
      .catch(function (error) {
        console.log('Error: addSpotifyMainData');
        console.log(error.response);
      });
  });
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
            element.albumArtUrl = res.data.tracks[0].album.images[1].url;
            element.topTrackURIs = res.data.tracks.map((track: any) => track.uri);
          } catch (err) {
            console.log('Error at adding top tracks');
            console.log(err);
          }

          resolve();
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }
}

const createNewCollection = async (linked_data: any, collection_name: string, db_connect: any) => {
  let name = collection_name;
  await db_connect.createCollection(name, (err: any, result: any) => {
    console.log(name + ' created!');
  });

  const duplicatesRemoved = removeDuplicateArtists(linked_data);

  await db_connect.collection(name).insertMany(duplicatesRemoved, (err: any, res: any) => {
    console.log('Successfully added ' + res.insertedCount + ' records to ' + name);
  });
};
