import { Box, Button, Grid, Typography } from "@mui/material";
import { Festivals } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../../Rifflandia/constants/colours";
import { usePlaylistQuery } from "../../hooks/usePlaylistQuery";
import { useMissingTracks } from "../../hooks/useMissingTracks";
import { useAuth } from "../../context/AuthContext";
import { setDocumentTitle } from "../../hooks/useDocumentTitleEffect";
import { WEBSITE_PACHENA_BAY } from "../../constants/locations";
import { SignInButton } from "../../components/SignInButton";
import { RecordShopTitle } from "../../components/RecordShopTitle";
import pachenaBayTextLogo from "./assets/pachenaBayTextLogo.png";
import { PreviewPlaylist } from "../../components/PreviewPlaylist";
import { AboutUsPopover } from "../../components/AboutUsPopover";
import "./pachenaBayStyles.css";
import { ProfileMenu } from "../../components/ProfileMenu";
import { goToNewTab } from "../../utils/browserUtils";

const DB_COLLECTION_NAME = Festivals.PachenaBay;

const SAMPLE_PLAYLIST_URL = "https://open.spotify.com/playlist/0v9ue8L0rG6OqxKc2hbAZh";
const TICKET_LINK = WEBSITE_PACHENA_BAY;
const CREATE_PLAYLIST_NAME = "Record Shop Pachena Bay 2024";

const GLOBAL_CSS_CLASSNAME = "pachena";

// TODO clean these colours up
const COLOURS = Object.freeze({
  pageBackground: "#3B6AB3",
  text: "#FCFCFC",
  description: {
    background: "#3B6AB3",
    text: "#FCFCFC",
  },
  primaryButton: {
    background: "#EE97A6",
    text: "#FCFCFC",
    hover: {
      background: "#FCFCFC",
      text: "#312F2E",
    },
  },
  secondaryButton: {
    background: "#5C9188",
    text: "#FCFCFC",
    hover: {
      background: "#FCFCFC",
      text: "#312F2E",
    },
  },
  settingsBackground: RIFFLANDIA_COLOURS.fill_pale_green,
  stickyButtonBackground: RIFFLANDIA_COLOURS.fill_light_orange,
  cardColours: RIFF_CARD_COLOURS,
});

export const PachenaBay = () => {
  const { isLoggedIntoSpotify, redirectToAuth, logOut } = useAuth();
  const { data: gigs } = useGigsQuery(DB_COLLECTION_NAME);
  const { data: playlist } = usePlaylistQuery(CREATE_PLAYLIST_NAME);
  const missingTracks = useMissingTracks(playlist, gigs);

  setDocumentTitle("Record Shop | Pachena Bay");

  return (
    <div className={GLOBAL_CSS_CLASSNAME}>
      <Box
        className="pachena-page"
        sx={{
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Grid container justifyContent="center" className="pachena-background-swirls">
          <div className="sidebar sidebar-coral-red" />
          <div className="sidebar sidebar-coral-pink" />
          <div className="sidebar sidebar-coral-blue" />
          <div className="sidebar sidebar-pink-googly-eye" />

          <Grid item xs={11} sm={10} md={6} sx={{ zIndex: 3 }}>
            <Grid
              container
              direction="row"
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems="center"
              sx={{ marginTop: "12px" }}
              columnGap={4}
            >
              <RecordShopTitle textColour={COLOURS.text} />

              <AboutUsPopover globalClassName={GLOBAL_CSS_CLASSNAME} />
            </Grid>

            <Typography sx={{ marginTop: "12px", color: COLOURS.text }}>
              Effortlessly generate a playlist within seconds featuring the top tracks from each artist performing at
              Pachena Bay.
            </Typography>

            {/* {!isLoggedIntoSpotify() ? (
              // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard
              // TODO: make this button work for in-app
              <SignInButton redirectToAuth={redirectToAuth} className="primary-button" />
            ) : (
              <Button variant="contained" onClick={logOut}>
                Sign Out
              </Button>
            )} */}
            {/* {playlist && <MissingGigsList playlist={playlist} missingTracks={missingTracks} />}
      <GigList gigs={gigs} cardColours={RIFF_CARD_COLOURS} /> */}

            <PreviewPlaylist playlistUrl={SAMPLE_PLAYLIST_URL} className="preview-playlist" />
          </Grid>
        </Grid>

        <Grid container justifyContent="center">
          <Grid item xs={11} sm={10} md={6} sx={{ zIndex: 3 }}>
            <Grid
              container
              direction="row"
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems="flex-start"
              sx={{ marginTop: "48px" }}
              columnGap={2}
            >
              <div style={{ maxWidth: "350px" }}>
                <img src={pachenaBayTextLogo} alt="Pachena Bay Music Festival" style={{ width: "100%" }} />
                <Button
                  className="secondary-button"
                  onClick={() => goToNewTab(TICKET_LINK)}
                  variant="outlined"
                  sx={{ width: "200px", margin: "12px 0" }}
                >
                  Buy Tickets
                </Button>
              </div>

              {/* // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard
              // TODO: make this button work for in-app */}
              {isLoggedIntoSpotify() ? (
                <ProfileMenu />
              ) : (
                <SignInButton redirectToAuth={redirectToAuth} className="primary-button" />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
