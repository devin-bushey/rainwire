import { SpotifyColour } from "../theme/AppStyles";
import spotifyIconBlack from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import spotifyIconWhite from "../spotifyLogos/Spotify_Icon_RGB_White.png";
import spotifyIconGreen from "../spotifyLogos/Spotify_Icon_RGB_Green.png";

export const SpotifyIcon = (colour?: SpotifyColour) => {
  let spotifyIcon;
  switch (colour) {
    case SpotifyColour.White:
      spotifyIcon = spotifyIconWhite;
      break;
    case SpotifyColour.Green:
      spotifyIcon = spotifyIconGreen;
      break;
    default:
      spotifyIcon = spotifyIconBlack;
  }

  return <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "12px" }} />;
};
