import { Button, Typography } from "@mui/material";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";

type ButtonColours = {
  background: string;
  text: string;
  hover: {
    background: string;
    text: string;
  };
};

export const SignInButton = ({ redirectToAuth, colours }: { redirectToAuth: () => void; colours: ButtonColours }) => (
  <Button
    onClick={redirectToAuth}
    variant="contained"
    sx={{
      backgroundColor: colours.background,
      color: colours.text,
      ":hover": {
        backgroundColor: colours.hover.background,
        color: colours.hover.text,
      },
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
