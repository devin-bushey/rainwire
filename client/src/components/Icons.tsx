import spotifyIconBlackPng from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import spotifyIconWhitePng from "../spotifyLogos/Spotify_Icon_RGB_White.png";

export const SpotifyIcon = (colour?: "black" | "white") => {
  if (colour === "white") {
    return (
      <img src={spotifyIconWhitePng} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
    );
  } else {
    return (
      <img src={spotifyIconBlackPng} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
    );
  }
};
