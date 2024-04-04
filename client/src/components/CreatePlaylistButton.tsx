import { Button, Typography } from "@mui/material";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import "../styles/ClickMe.css";

export const CreatePlaylistButton = ({
  handleCreatePlaylist,
  backgroundColor,
  hoverColor,
}: {
  handleCreatePlaylist: () => void;
  backgroundColor?: string;
  hoverColor?: string;
}) => {
  return (
    <Button
      onClick={handleCreatePlaylist}
      variant="contained"
      className="primary-button"
      sx={{
        backgroundColor: backgroundColor,
        ":hover": {
          backgroundColor: hoverColor,
        },
        color: "black",
        width: "300px",
        justifyContent: "center",
        height: "48px",
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
      <Typography sx={{ paddingBottom: 0 }}>Generate playlist</Typography>
    </Button>
  );
};
