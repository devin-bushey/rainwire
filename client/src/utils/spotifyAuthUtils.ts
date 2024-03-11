import { AUTH_ENDPOINT, CLIENT_ID, SCOPES } from '../constants/auth';
import { getCurrentUrl, reloadPage } from './browserUtils';

export const handleRedirectToAuth =
  (redirectUri: string = getCurrentUrl()) =>
  () => {
    location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SCOPES.join(
      '%20',
    )}&response_type=token&show_dialog=true`;
  };

export const logOut = () => {
  localStorage.clear();
  reloadPage();
};

export const isLoggedIntoSpotify = () => Boolean(localStorage.getItem('spotifyToken'));
