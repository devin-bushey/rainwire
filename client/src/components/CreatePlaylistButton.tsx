import { Button, Tooltip, Typography } from "@mui/material";
import { primaryButtonColours } from "../theme/AppStyles";
import { isLoggedIntoSpotify } from "../utils/spotifyAuthUtils";
import { SpotifyIcon } from "./Icons";
import "../styles/ClickMe.css";

export const CreatePlaylistButton = ({ handleCreatePlaylist }: { handleCreatePlaylist: () => void }) => {
  const disabled = !isLoggedIntoSpotify();

  if (disabled) {
    return (
      <Tooltip title="Sign in to unlock this feature!">
        <span>
          <Button
            disabled
            variant="contained"
            sx={{
              width: "300px",
              marginBottom: "16px",
              justifyContent: "center",
              height: "48px",
            }}
            style={{ backgroundColor: "#B5B5B5", color: "#696969" }}
          >
            {SpotifyIcon()}
            <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
          </Button>
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Button
        onClick={handleCreatePlaylist}
        variant="contained"
        className="primary-button"
        sx={{
          ...primaryButtonColours,
          width: "300px",
          justifyContent: "center",
          height: "48px",
        }}
      >
        {SpotifyIcon()}
        <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
      </Button>
    );
  }
};
