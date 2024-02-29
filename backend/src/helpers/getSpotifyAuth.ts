import { post } from '../http/request';

export const getSpotifyAuth = async () => {
  var client_id = process.env.SP_CLIENT_ID;
  var client_secret = process.env.SP_CLIENT_S;

  return await new Promise(function (resolve, reject) {
    post({
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      params: {
        grant_type: 'client_credentials',
      },
    })
      .then(function (response: any) {
        resolve(response.data.access_token);
      })
      .catch(function (error: any) {
        console.log('Error: POST getAccessToken');
        console.log(error);
      });
  });
};
