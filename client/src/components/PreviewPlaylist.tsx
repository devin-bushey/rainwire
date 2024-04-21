import { Box, Button, Card, Typography } from "@mui/material";
import { goToNewTabOnDesktop } from "../utils/browserUtils";
import { PageClassName, SpotifyColour, getSpotifyIcon } from "../theme/AppStyles";
import { SpotifyIcon } from "./Icons";

export const PreviewPlaylist = ({
  playlistUrl,
  pageClassName,
  iconColour,
}: {
  playlistUrl: string;
  pageClassName?: PageClassName;
  iconColour?: SpotifyColour;
}) => (
  <Box
    className={`preview-playlist ${pageClassName}`}
    sx={{
      margin: "24px 0",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Card sx={{ maxWidth: "70%", padding: "24px" }} className="preview-playlist-card">
      <Typography>Not sure where to start? We&#39;ve created a sample playlist for you to check out!</Typography>

      <Button
        onClick={() => goToNewTabOnDesktop(playlistUrl)}
        sx={{
          width: "100%",
          maxWidth: "210px",
          marginTop: "12px",
          justifyContent: "center",
          height: "36px",
        }}
        className="secondary-button"
      >
        {SpotifyIcon(iconColour)}
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "700",
            paddingBottom: 0,
          }}
        >
          Preview a Playlist
        </Typography>
      </Button>
    </Card>
  </Box>
);
