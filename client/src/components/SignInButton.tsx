import { Button, Typography } from "@mui/material";
import spotifyIconBlack from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import spotifyIconWhite from "../spotifyLogos/Spotify_Icon_RGB_White.png";

export const SignInButton = ({
  redirectToAuth,
  iconColour,
}: {
  redirectToAuth: () => void;
  iconColour?: "black" | "white";
}) => {
  const spotifyIcon = iconColour === "white" ? spotifyIconWhite : spotifyIconBlack;
  return (
    <Button
      onClick={redirectToAuth}
      variant="contained"
      className="primary-button"
      sx={{
        justifyContent: "center",
        width: "160px",
        height: "48px",
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
      <Typography sx={{ fontWeight: "700", paddingBottom: 0 }}>Sign in</Typography>
    </Button>
  );
};
