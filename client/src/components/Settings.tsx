import { Typography, Slider, Link, Grid } from "@mui/material";
import { SpotifyColour } from "../theme/AppStyles";
import { SpotifyIcon } from "./Icons";

type SettingsProps = {
  numTopTracks: number;
  setNumTopTracks: (numTopTracks: number) => void;
  iconColour?: SpotifyColour;
  customSettings?: Array<JSX.Element>;
};

export const Settings = ({ numTopTracks, setNumTopTracks, iconColour, customSettings }: SettingsProps) => {
  const marks = [];
  for (let i = 1; i <= 5; i++) {
    marks.push({
      value: i,
      label: `${i}`,
    });
  }

  return (
    <Grid
      container
      className="settings-container"
      justifyContent="center"
      sx={{
        width: "100%",
        margin: "12px 0",
        padding: "32px",
        borderRadius: "10px",
        backgroundColor: "hsl(141, 12%, 80%)",
      }}
      columnGap={6}
      rowGap={4}
    >
      <Grid item xs={12} justifyContent="center">
        <Typography variant="h6">
          {SpotifyIcon(iconColour)}
          Customize
        </Typography>
      </Grid>

      <Grid item xs={12} sm={5} justifyContent="center">
        <Typography>Select number of top tracks:</Typography>
        <Slider
          aria-label="Number of tracks per artist"
          valueLabelDisplay="auto"
          className="top-tracks-slider"
          step={1}
          marks={marks}
          min={1}
          max={5}
          value={numTopTracks}
          onChange={(event, val) => setNumTopTracks(typeof val === "number" ? val : 1)}
          sx={{ width: "90%" }}
        />
      </Grid>

      {customSettings?.map((setting, i) => (
        <Grid item xs={12} sm={5} justifyContent="center" key={`custom-setting-${i}`}>
          {setting}
        </Grid>
      ))}

      <Grid item xs={12} justifyContent="center" sx={{ marginTop: "12px" }}>
        <Link href="https://www.spotify.com/account/apps">
          <Typography sx={{ fontSize: "12px" }} className="unsubscribe-label">
            Unsubscribe
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};
