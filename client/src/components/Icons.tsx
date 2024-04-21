import { SpotifyColour, getSpotifyIcon } from "../theme/AppStyles";

export const SpotifyIcon = (colour?: SpotifyColour) => {
  const spotifyIcon = getSpotifyIcon(colour);

  return <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />;
};
