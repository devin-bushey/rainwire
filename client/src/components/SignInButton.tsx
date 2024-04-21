import { Button, Typography } from "@mui/material";
import { SpotifyColour } from "../theme/AppStyles";
import { SpotifyIcon } from "./Icons";

export const SignInButton = ({
  redirectToAuth,
  iconColour,
}: {
  redirectToAuth: () => void;
  iconColour?: SpotifyColour;
}) => (
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
    {SpotifyIcon(iconColour)}
    <Typography sx={{ fontWeight: "700", paddingBottom: 0 }}>Sign in</Typography>
  </Button>
);
