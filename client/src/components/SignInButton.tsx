import { Button, Typography } from "@mui/material";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";

export const SignInButton = ({ redirectToAuth, className }: { redirectToAuth: () => void; className?: string }) => (
  <Button
    onClick={redirectToAuth}
    variant="contained"
    className={className}
    sx={{
      justifyContent: "center",
      width: "200px",
      height: "48px",
      marginTop: "24px",
    }}
  >
    <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
    <Typography sx={{ fontWeight: "700", paddingBottom: 0 }}>Sign in</Typography>
  </Button>
);
