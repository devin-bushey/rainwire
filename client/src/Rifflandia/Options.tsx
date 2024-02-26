import { Typography, Slider, Button, Link } from "@mui/material";
import { Box } from "@mui/system";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { RIFFLANDIA_COLOURS } from "./constants/colours";
import "./styles/styles.css";
import { useNavigate } from "react-router-dom";
import { reloadPage } from "../utils/browserUtils";

export const Options = (props: any) => {
  const DAYS = ["Sept 7", "Sept 15", "Sept 8", "Sept 16", "Sept 9", "Sept 17"];

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

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate("/rifflandia");
    reloadPage();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        className="options-container"
        sx={{
          marginTop: "12px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: props.colour ? props.colour : "hsl(141, 12%, 80%)",
          minHeight: "290px",
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

        <Box className="option-box">
          <Box className="option-tracks-dates">
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

          <Box className="option-tracks-dates">
            <Typography>Select dates to add:</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {DAYS.map((day: any) => (
                <Button
                  variant="outlined"
                  key={day}
                  onClick={() => props.handleDayClick(day)}
                  sx={{
                    width: "110px",
                    margin: "8px 2px",
                    marginBottom: "2px",
                    background: props.selectedDays.includes(day)
                      ? RIFFLANDIA_COLOURS.fill_light_orange
                      : "none",
                    "&:hover": {
                      background: props.selectedDays.includes(day)
                        ? RIFFLANDIA_COLOURS.fill_light_orange
                        : "none",
                    },
                  }}
                >
                  {day}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        {!(!props.token || !props.spotifyInfo || !props.spotifyInfo.access) && (
          <>
            {/* <Button variant="outlined" sx={{ marginTop: '24px', width: '200px' }} onClick={logOut}>
              Sign Out
            </Button> */}

            <Box sx={{ marginTop: "12px" }}>
              <Link href="https://www.spotify.com/account/apps">
                <Typography sx={{ fontSize: "12px" }}>Unsubscribe</Typography>
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
