import { Box, Button, Card, Typography } from "@mui/material";
import { goToNewTabOnDesktop } from "../utils/browserUtils";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";

export const PreviewPlaylist = ({ playlistUrl, className }: { playlistUrl: string; className: string }) => (
  <Box
    className={className}
    sx={{
      margin: "24px 0",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Card sx={{ maxWidth: "70%" }}>
      <Typography>Not sure where to start? We&#39;ve created a sample playlist for you to check out!</Typography>

      <Button
        onClick={() => goToNewTabOnDesktop(playlistUrl)}
        variant="outlined"
        sx={{
          width: "230px",
          marginTop: "12px",
          justifyContent: "center",
          height: "36px",
        }}
      >
        <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
        <Typography
          sx={{
            fontSize: "0.8rem",
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
