import { SpotifyColour } from "../theme/AppStyles";
import spotifyIconBlack from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import spotifyIconWhite from "../spotifyLogos/Spotify_Icon_RGB_White.png";
import spotifyIconGreen from "../spotifyLogos/Spotify_Icon_RGB_Green.png";

export const getSpotifyIcon = (colour: SpotifyColour = SpotifyColour.Black) => {
  switch (colour) {
    case SpotifyColour.White:
      return spotifyIconWhite;
    case SpotifyColour.Green:
      return spotifyIconGreen;
    default:
      return spotifyIconBlack;
  }
};

export const SpotifyIcon = (colour?: SpotifyColour) => {
  const spotifyIcon = getSpotifyIcon(colour);

  return <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "12px" }} />;
};
