import { Button, Tooltip, Typography } from "@mui/material";
import { primaryButtonColours } from "../theme/AppStyles";
import { isLoggedIntoSpotify } from "../utils/spotifyAuthUtils";
import { SpotifyIcon } from "./Icons";
import "../styles/ClickMe.css";

export const CreatePlaylistButton = ({ handleCreatePlaylist }: { handleCreatePlaylist: () => void }) => {
  const disabled = !isLoggedIntoSpotify();

  const commonButtonProps = {
    width: "300px",
    justifyContent: "center",
    height: "48px",
    marginTop: "8px",
  };

  return (
    <div style={{ textAlign: "center" }}>
      {disabled ? (
        <Tooltip placement="top" title="Sign in to unlock this feature!">
          <span>
            <Button
              disabled
              variant="contained"
              sx={commonButtonProps}
              style={{ backgroundColor: "#B5B5B5", color: "#696969" }}
            >
              {SpotifyIcon()}
              <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
            </Button>
          </span>
        </Tooltip>
      ) : (
        <Button
          onClick={handleCreatePlaylist}
          variant="contained"
          className="primary-button"
          sx={{
            ...primaryButtonColours,
            ...commonButtonProps,
          }}
        >
          {SpotifyIcon()}
          <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
        </Button>
      )}
    </div>
  );
};
