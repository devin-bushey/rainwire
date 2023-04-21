import axios from 'axios';
import { SpotifyPlaylistDataType, SpotifyUserDataType } from '../types/SpotifyTypes';

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
  const playlist_name = 'Record Shop - ' + city;

  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    data: {
      name: playlist_name,
      description: 'a mixtape of upcoming concerts --> created by recordshopp.netlify.app',
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

export const CreateNewPlaylist = async ({ token, city, user_id }: { token: string; city: string; user_id: string }) => {
  const playlist_data: SpotifyPlaylistDataType = await CreateBlankPlaylist({ token, city, user_id });

  axios
    .get(import.meta.env.VITE_SITE_URL_DB + city + '/')
    .then((response) => {
      const data = response.data;
      let tracks = '';
      const numTopTracksToAdd = 1;

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

      if (playlist_data.new_playlist_id && playlist_data.external_urls?.spotify) {
        AddTracksToPlaylist(token, playlist_data.new_playlist_id, playlist_data.external_urls?.spotify, tracks);
      }
    })
    .catch(function (error) {
      console.log('Error CreateNewPlaylist');
      console.log(error);
    });
};

const AddTracksToPlaylist = (token: string, playlist_id: string, playlist_url: string | URL, tracks: string) => {
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
      window.alert('Error: unsuccessfully added tracks to playlist');
      console.log(error);
    });
};
