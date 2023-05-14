import axios from 'axios';
import { SpotifyPlaylistDataType, SpotifyUserDataType } from '../types/SpotifyTypes';
import { Festivals } from '../constants/enums';

export const GetSpotifyUserInfo = async (token: string): Promise<SpotifyUserDataType> => {
  return axios({
    url: 'https://api.spotify.com/v1/me/',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      const data = response.data;
      const user_name = data.display_name;
      const user_id = data.id;
      const firstName = data.display_name.substring(0, data.display_name.indexOf(' ')).trim();

      return {
        firstName: firstName,
        user_name: user_name,
        user_id: user_id,
        new_playlist_id: '',
        access: true,
        error: false,
      };
    })
    .catch((error: any) => {
      console.log('Error: GetSpotifyUserInfo');
      console.log(error);
      console.log(error.message);

      if (error.response.status === 403) {
        return {
          firstName: '',
          user_name: '',
          user_id: '',
          new_playlist_id: '',
          access: false,
        };
      }

      return {
        firstName: '',
        user_name: '',
        user_id: '',
        new_playlist_id: '',
        access: false,
        error: true,
      };
    });
};

const CreateBlankPlaylist = async ({
  token,
  city,
  user_id,
}: {
  token: string;
  city: string;
  user_id: string;
}): Promise<SpotifyPlaylistDataType> => {
  let playlist_name = 'record shop ' + city;

  if (city === Festivals.PhilipsBackyard) {
    playlist_name = 'record shop philips backyard';
  }

  if (city === Festivals.LaketownShakedown) {
    playlist_name = 'record shop laketown shakedown';
  }

  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    data: {
      name: playlist_name,
      description: 'a mixtape of upcoming concerts created by recordshop.cool',
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

      console.log('Successfully created a playist: ' + playlist_name);

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

export const CreateNewPlaylist = async ({
  token,
  city,
  user_id,
  setIsError,
  numTopTracks,
  tickets,
}: {
  token: string;
  city: string;
  user_id: string;
  setIsError: any;
  numTopTracks?: number;
  tickets?: any;
}) => {
  const reqBody = [];

  if (tickets && tickets.length > 0) {
    for (const ticket of tickets) {
      reqBody.push(ticket.ticket_band);
    }
  }

  axios
    .post(import.meta.env.VITE_SITE_URL_DB + 'tickets/', reqBody, {
      params: {
        city: city,
      },
    })
    .then(async (response) => {
      const data = response.data;
      let tracks = '';
      const numTopTracksToAdd = numTopTracks ? numTopTracks : 1;
      for (const element of data) {
        try {
          for (let i = 0; i < numTopTracksToAdd; i++) {
            tracks += element.top_tracks[i].uri;
            tracks += ',';
          }
        } catch (error) {
          console.log(error);
        }
      }

      tracks = tracks.substring(0, tracks.length - 1); // remove last comma

      const playlist_data: SpotifyPlaylistDataType = await CreateBlankPlaylist({ token, city, user_id });

      const array = tracks.split(',');
      // console.log('tracks: ' + array.length);
      // console.log('array: ' + array);

      let array1 = array;
      let array2: string[] = [];
      let array3: string[] = [];
      let array4: string[] = [];

      // Max playlist length = 400
      if (array.length > 100 && array.length < 200) {
        array1 = array.slice(0, 100);
        array2 = array.slice(100, array.length);
      } else if (array.length > 200 && array.length < 300) {
        array1 = array.slice(0, 100);
        array2 = array.slice(100, 200);
        array3 = array.slice(200, array.length);
      } else {
        array1 = array.slice(0, 100);
        array2 = array.slice(100, 200);
        array3 = array.slice(200, 300);
        array4 = array.slice(300, 400);
      }

      const arrays = [array1, array2, array3, array4];

      arrays.forEach((array) => {
        if (array.length === 0) return;
        let tracks = '';
        array.forEach((track) => {
          tracks += track;
          tracks += ',';
        });
        tracks = tracks.substring(0, tracks.length - 1); // remove last comma
        if (playlist_data.new_playlist_id && playlist_data.external_urls?.spotify) {
          AddTracksToPlaylist(
            token,
            playlist_data.new_playlist_id,
            playlist_data.external_urls?.spotify,
            tracks,
            setIsError,
          );
        }
      });
    })
    .catch(function (error) {
      console.log('Error CreateNewPlaylist');
      console.log(error);
    });
};

const AddTracksToPlaylist = (
  token: string,
  playlist_id: string,
  playlist_url: string | URL,
  tracks: string,
  setIsError: any,
) => {
  axios({
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?uris=' + tracks,
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      console.log('Successfully added tracks to playlist');
      window.location.assign(playlist_url);
    })
    .catch(function (error) {
      console.log('Error: unsuccessfully added tracks to playlist');
      //window.alert('Error: unsuccessfully added tracks to playlist');
      setIsError(true);
      console.log(error);
    });
};
