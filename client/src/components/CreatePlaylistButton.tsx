import { Button, Typography } from "@mui/material";
import { primaryButtonColours } from "../theme/AppStyles";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import "../styles/ClickMe.css";

export const CreatePlaylistButton = ({ handleCreatePlaylist }: { handleCreatePlaylist: () => void }) => {
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
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
      <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
    </Button>
  );
};
