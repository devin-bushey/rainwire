import { Typography, Slider, Link } from "@mui/material";
import { Box } from "@mui/system";
import { COLOURS } from "../theme/AppStyles";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import "../styles/Settings.css";

export const Settings = (props: any) => {
  const marks = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        className="main-options-container"
        sx={{
          marginTop: "12px",
          marginBottom: "12px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: props.colour ? props.colour : "hsl(141, 12%, 80%)",
          //minHeight: '290px',
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
          <Typography variant="h6" sx={{ color: COLOURS.black }}>
            <img
              src={spotifyIcon}
              alt="spotify_logo"
              width="20px"
              height="20px"
              style={{ marginRight: "8px" }}
            />
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
                step={1}
                marks={marks}
                min={1}
                max={5}
                value={props.numTopTracks}
                onChange={props.handleNumTopTracks}
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
            <Typography sx={{ fontSize: "12px" }}>Unsubscribe</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
