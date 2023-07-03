import { Festivals } from '../enums/common';
import axios, { AxiosError } from 'axios';
import { SpotifyPlaylistDataType } from '../types/SpotifyTypes';
import { PLAYLIST_IMG_RS } from '../assets/recordshop_img';
import { sortByPopularity } from './sortByPopularity';
import { sortByDateAndOrder } from './sortByDateAndOrder';

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
  try {
    await AddCoverArt({ token, playlist_id });
  } catch (err) {
    console.log('Error adding cover art');
  }

  const numTopTracksToAdd = numTopTracks ? numTopTracks : 1;

  const sortedArtists = sortBy === 'popularity' ? sortByPopularity(artists) : sortByDateAndOrder(artists);

  let tracks = '';

  for (const artist of sortedArtists) {
    try {
      for (let i = 0; i < numTopTracksToAdd; i++) {
        if (artist.topTrackURIs && artist.topTrackURIs[i]) {
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
  return axios({
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/images',
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'image/jpeg',
    },
    data: PLAYLIST_IMG_RS,
  }).catch(function (error) {
    const err = error as AxiosError;
    console.log('Error: unsuccessfully added cover art to playlist');
    console.log(err.message);
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
  }).catch(function (error) {
    const err = error as AxiosError;
    console.log('Error: unsuccessfully added tracks to playlist');
    console.log(err.message);
    return null;
  });
};
