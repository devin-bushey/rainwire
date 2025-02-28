import { AUTH_ENDPOINT, CLIENT_ID, SCOPES } from "../constants/auth";
import { getCurrentUrlWithoutParams, goTo, isInAppBrowser, reloadPage } from "./browserUtils";

export const redirectToAuth = (redirectUri?: unknown) => {
  // this fn gets passed a button event in certain cases, hence the type check here
  redirectUri = typeof redirectUri === "string" ? redirectUri : getCurrentUrlWithoutParams();

  location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SCOPES.join(
    "%20",
  )}&response_type=token&show_dialog=true`;
};

export const redirectToAuthForBrowser = (openInAppModal: () => void, postRedirectUri?: string) =>
  isInAppBrowser() ? openInAppModal : () => redirectToAuth(postRedirectUri);

export const logOut = () => {
  localStorage.clear();
  goTo(getCurrentUrlWithoutParams());
  reloadPage();
};

export const isLoggedIntoSpotify = () => Boolean(localStorage.getItem("spotifyToken"));
