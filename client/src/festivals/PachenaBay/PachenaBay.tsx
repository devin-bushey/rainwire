import { Box, Button, Collapse, Grid, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Festivals } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { useAuth } from "../../context/AuthContext";
import { setDocumentTitle } from "../../hooks/useDocumentTitleEffect";
import { WEBSITE_PACHENA_BAY } from "../../constants/locations";
import { SignInButton } from "../../components/SignInButton";
import { RecordShopTitle } from "../../components/RecordShopTitle";
import pachenaBayTextLogo from "./assets/pachenaBayTextLogo.png";
import { PreviewPlaylist } from "../../components/PreviewPlaylist";
import { AboutUsPopover } from "../../components/AboutUsPopover";
import { ProfileMenu } from "../../components/ProfileMenu";
import { goToNewTab } from "../../utils/browserUtils";
import { PageClassName } from "../../theme/AppStyles";
import { GigList } from "../../components/GigList";
import { redirectToAuth } from "../../utils/spotifyAuthUtils";
import { useSettingsState } from "../../hooks/useSettingsCollapse";
import { Settings } from "../../components/Settings";

import "./pachenaBayStyles.css";

const DB_COLLECTION_NAME = Festivals.PachenaBay;

const SAMPLE_PLAYLIST_URL = "https://open.spotify.com/playlist/0v9ue8L0rG6OqxKc2hbAZh";
const TICKET_LINK = WEBSITE_PACHENA_BAY;

const PACHENA_PAGE_CLASS = PageClassName.PachenaBay;

const COLOURS = Object.freeze({
  text: "#FCFCFC",
  cardColours: ["#F1B3B5", "#FFEAC2", "#5C9188", "#F06A48"],
});

export const PachenaBay = () => {
  const { isLoggedIntoSpotify } = useAuth();
  const { data: gigs, isLoading: isGigsQueryLoading } = useGigsQuery(DB_COLLECTION_NAME);
  const { isSettingsOpen, openSettings, closeSettings, numTopTracks, setNumTopTracks } = useSettingsState();

  setDocumentTitle("Record Shop | Pachena Bay");

  return (
    <div className={PACHENA_PAGE_CLASS}>
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

              <AboutUsPopover pageClassName={PACHENA_PAGE_CLASS} />
            </Grid>

            <Typography sx={{ marginTop: "12px", color: COLOURS.text }}>
              Effortlessly generate a playlist within seconds featuring the top tracks from each artist performing at
              Pachena Bay.
            </Typography>

            <PreviewPlaylist playlistUrl={SAMPLE_PLAYLIST_URL} className="preview-playlist" />
          </Grid>
        </Grid>

        <Grid container justifyContent="center">
          <Grid item xs={11} sm={10} md={6} sx={{ zIndex: 3 }}>
            <Grid
              container
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems="flex-start"
              sx={{ marginTop: "48px" }}
              columnGap={2}
            >
              <Grid item style={{ maxWidth: "350px" }}>
                <img src={pachenaBayTextLogo} alt="Pachena Bay Music Festival" style={{ width: "100%" }} />
                <Button
                  className="secondary-button"
                  onClick={() => goToNewTab(TICKET_LINK)}
                  variant="outlined"
                  sx={{ width: "180px", margin: "12px 0" }}
                >
                  Buy Tickets
                </Button>
              </Grid>

              {/* // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard
              // TODO: make this button work for in-app */}
              <Grid item style={{ display: "grid" }} width={{ xs: "100%", sm: "auto" }}>
                {isLoggedIntoSpotify() ? (
                  <ProfileMenu />
                ) : (
                  <div style={{ justifySelf: "center" }}>
                    <SignInButton redirectToAuth={redirectToAuth} className="primary-button" />
                  </div>
                )}
                <IconButton
                  sx={{ marginLeft: "8px", justifySelf: "end", marginTop: "12px", color: "white" }}
                  onClick={() => (isSettingsOpen ? closeSettings() : openSettings())}
                  disableRipple={true}
                >
                  <SettingsIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>

            <Collapse in={isSettingsOpen} collapsedSize={0}>
              <Settings numTopTracks={numTopTracks} setNumTopTracks={setNumTopTracks} />
            </Collapse>

            <Box margin="24px 0">
              <GigList gigs={gigs} isQueryLoading={isGigsQueryLoading} cardColours={COLOURS.cardColours} />
            </Box>

            {/* {playlist && <MissingGigsList playlist={playlist} missingTracks={missingTracks} />}
              <GigList gigs={gigs} cardColours={COLOURS.cardColours} /> */}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
