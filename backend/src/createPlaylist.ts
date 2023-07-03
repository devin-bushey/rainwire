import { Festivals } from './enums/common';
import axios, { AxiosError } from 'axios';
import { SpotifyPlaylistDataType } from './SpotifyTypes';
import { PLAYLIST_IMG_RS } from './assets/recordshop_img';

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  numTopTracks,
  artists,
  sortBy,
  days,
}: {
  token: string;
  city: string;
  user_id: string;
  numTopTracks?: number;
  artists: any;
  sortBy: string;
  days: string[];
}) => {
  const playlist_data: SpotifyPlaylistDataType = await CreateBlankPlaylist({ token, city, user_id, days });

  const playlist_id = playlist_data.new_playlist_id || '';
  await AddCoverArt({ token, playlist_id });

  const numTopTracksToAdd = numTopTracks ? numTopTracks : 1;

  const sortedArtists = sortBy === 'popularity' ? sortByPopularity(artists) : sortDataByDateAndOrder(artists);

  let tracks = '';

  for (const artist of sortedArtists) {
    try {
      for (let i = 0; i < numTopTracksToAdd; i++) {
        if (artist.topTrackURIs && artist.topTrackURIs[i]) {
          //console.log(artist.sp_band_name, ' ', artist.day);
          tracks += artist.topTrackURIs[i];
          tracks += ',';
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  tracks = tracks.substring(0, tracks.length - 1); // remove last comma

  const array = tracks.split(',');
  const MAX_CHUNK_LENGTH = 75;
  const trackArrays = [];

  while (array.length > 0) {
    const chunk = array.splice(0, MAX_CHUNK_LENGTH);
    trackArrays.push(chunk);
  }

  for (const trackArray of trackArrays) {
    const tracks = trackArray.join(',');
    if (playlist_data.new_playlist_id && playlist_data.external_urls?.spotify) {
      await AddTracksToPlaylist(token, playlist_data.new_playlist_id, tracks);
    }
  }
  return playlist_data.external_urls?.spotify;
};

const sortDataByDateAndOrder = (data: any) => {
  data.sort((a: any, b: any) => {
    // First, compare the dates
    const dateA = new Date(a.day);
    const dateB = new Date(b.day);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      // If the dates are the same, compare the orders
      if (a.popularity < b.popularity) {
        return -1;
      } else if (a.popularity > b.popularity) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  return data;
};

const sortByPopularity = (tickets: any) => {
  tickets.sort((a: any, b: any) => {
    return a.popularity - b.popularity;
  });

  return tickets;
};

const CreateBlankPlaylist = async ({
  token,
  city,
  user_id,
  days,
}: {
  token: string;
  city: string;
  user_id: string;
  days: string[];
}): Promise<SpotifyPlaylistDataType> => {
  let playlist_name = 'record shop ' + city;

  if (city === Festivals.PhilipsBackyard) {
    playlist_name = 'record shop phillips backyard';
  }

  if (city === Festivals.LaketownShakedown) {
    playlist_name = 'record shop laketown shakedown';
  }

  let description = `a mixtape created by recordshop.cool`;

  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    data: {
      name: playlist_name,
      description: description,
      public: true,
    },
  })
    .then((response) => {
      const data = response.data;

      const returnVal: SpotifyPlaylistDataType = {
        new_playlist_id: data.id,
        external_urls: {
          spotify: data.external_urls.spotify,
        },
      };

      //console.log('Successfully created a playist: ' + playlist_name);

      return returnVal;
    })
    .catch(function (error) {
      console.log('Error: CreateBlankPlaylist');
      console.log(error);

      const returnVal: SpotifyPlaylistDataType = {
        new_playlist_id: '',
        external_urls: {
          spotify: '',
        },
      };

      return returnVal;
    }); //end axios
};

const AddCoverArt = async ({ token, playlist_id }: { token: string; playlist_id: string }) => {
  // const image = path.join(__dirname, './playlist_img.jpg');
  // const file = fs.readFileSync(image, { encoding: 'base64' });

  return axios({
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/images',
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'image/jpeg',
    },
    data: PLAYLIST_IMG_RS,
  })
    .then(() => {
      //console.log('Successfully added tracks to playlist');
      //window.location.assign(playlist_url);
    })
    .catch(function (error) {
      console.log('Error: unsuccessfully added cover art to playlist');
      //window.alert('Error: unsuccessfully added tracks to playlist');
      console.log(error.message);
      //return null;
    });
};

const AddTracksToPlaylist = async (token: string, playlist_id: string, tracks: string) => {
  return axios({
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?uris=' + tracks,
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      //console.log('Successfully added tracks to playlist');
      //window.location.assign(playlist_url);
    })
    .catch(function (error) {
      const err = error as AxiosError;
      console.log('Error: unsuccessfully added tracks to playlist');
      //window.alert('Error: unsuccessfully added tracks to playlist');
      console.log(err.message);
      return null;
    });
};
