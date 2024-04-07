import { Button, Typography } from "@mui/material";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";

export const SignInButton = ({ redirectToAuth }: { redirectToAuth: () => void }) => (
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
