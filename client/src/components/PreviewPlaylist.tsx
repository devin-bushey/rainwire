import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { goToNewTabOnDesktop } from "../utils/browserUtils";
import { PageClassName, SpotifyColour } from "../theme/AppStyles";
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
  <Grid
    container
    className={`preview-playlist ${pageClassName}`}
    justifyContent="center"
    sx={{
      margin: "24px 0",
      display: "flex",
    }}
  >
    <Grid item xs={11} sm={9} lg={9} xl={8}>
      <Card sx={{ padding: "24px" }} className="preview-playlist-card">
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
    </Grid>
  </Grid>
);
