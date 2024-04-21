import { Typography, Slider, Link } from "@mui/material";
import { Box } from "@mui/system";
import { SpotifyColour } from "../theme/AppStyles";
import "../styles/Settings.css";
import { SpotifyIcon } from "./Icons";

type SettingsProps = {
  numTopTracks: number;
  setNumTopTracks: (numTopTracks: number) => void;
  iconColour?: SpotifyColour;
};

export const Settings = ({ numTopTracks, setNumTopTracks, iconColour }: SettingsProps) => {
  const marks = [];
  for (let i = 1; i <= 5; i++) {
    marks.push({
      value: i,
      label: `${i}`,
    });
  }

  return (
    <Box
      className="settings-container"
      sx={{
        marginTop: "12px",
        marginBottom: "12px",
        padding: "30px",
        borderRadius: "10px",
        backgroundColor: "hsl(141, 12%, 80%)",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <Typography variant="h6">
          {SpotifyIcon(iconColour)}
          Customize
        </Typography>
      </Box>

      <Box className="main-option-box">
        <Box className="main-option-tracks-dates">
          <Typography>Select number of top tracks:</Typography>
          <Box sx={{ width: "90%" }}>
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
            />
          </Box>
        </Box>

        {/* <Box className="option-tracks-dates">
            <Typography>Select dates to add:</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {DAYS.map((day: any) => (
                <Button
                  variant="outlined"
                  key={day}
                  onClick={() => props.handleDayClick(day)}
                  sx={{
                    width: '110px',
                    margin: '8px 2px',
                    marginBottom: '2px',
                  }}
                >
                  {day}
                </Button>
              ))}
            </Box>
          </Box>*/}
      </Box>

      <Box sx={{ marginTop: "24px" }}>
        <Link href="https://www.spotify.com/account/apps">
          <Typography sx={{ fontSize: "12px" }} className="unsubscribe-label">
            Unsubscribe
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};
