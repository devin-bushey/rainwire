import { Box, Button, Collapse, Grid, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Festivals } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { useAuth } from "../../context/AuthContext";
import { setDocumentTitle } from "../../hooks/useDocumentTitleEffect";
import { SignInButton } from "../../components/SignInButton";
import { RecordShopTitle } from "../../components/RecordShopTitle";
import { PreviewPlaylist } from "../../components/PreviewPlaylist";
import { AboutUsPopover } from "../../components/AboutUsPopover";
import { ProfileMenu } from "../../components/ProfileMenu";
import { goToNewTab } from "../../utils/browserUtils";
import { PageClassName } from "../../theme/AppStyles";
import { GigList } from "../../components/GigList";
import { redirectToAuthForBrowser } from "../../utils/spotifyAuthUtils";
import { useSettingsState } from "../../hooks/useSettingsCollapseState";
import { Settings } from "../../components/Settings";
import { StickyFadeButton } from "../../components/StickyFadeButton";
import { Spinner } from "../../components/Spinner";
import { CreatePlaylistButton } from "../../components/CreatePlaylistButton";
import { isMobile } from "../../utils/responsiveUtils";
import { useCreatePlaylistState } from "../../hooks/useCreatePlaylistState";
import laketownShakedownLogo from "./assets/laketownShakedownLogo.png";
import { InAppModal } from "../../components/InAppModal";
import { useInAppModalState } from "../../hooks/useInAppModalState";
import "./laketownShakedownStyles.css";

const DB_COLLECTION_NAME = Festivals.LaketownShakedown_2024;

const SAMPLE_PLAYLIST_URL = "https://open.spotify.com/playlist/6aKKi5FSh0MiBrbVAguDCG";
const TICKET_LINK = "https://www.laketownshakedown.com/";

const PAGE_CLASS = PageClassName.LaketownShakedown;

const COLOURS = Object.freeze({
  text: "#030918",
  cardColours: ["#4c9e8f", "#3f7a4a", "#bae2e8"],
  stickyFadeButtonBgColour: "#00223C",
});

export const LaketownShakedown = () => {
  const { isLoggedIntoSpotify } = useAuth();
  const { data: gigs, isLoading: isGigsQueryLoading } = useGigsQuery(DB_COLLECTION_NAME);
  const { isSettingsOpen, openSettings, closeSettings, numTopTracks, setNumTopTracks } = useSettingsState();
  const { isInAppModalOpen, openInAppModal, closeInAppModal } = useInAppModalState();

  const { isCreatingPlaylist, handleCreatePlaylist } = useCreatePlaylistState({
    dbCollectionName: DB_COLLECTION_NAME,
    numTopTracks,
  });

  setDocumentTitle("Record Shop | Laketown Shakedown");

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <div className={PAGE_CLASS}>
        <Box
          className="phillips-page"
          sx={{
            minHeight: "100vh",
            textAlign: "center",
          }}
        >
          <Grid container justifyContent="center" className="background-top">
            <div className="sidebar sidebar-darkened-bird" />
            <div className="sidebar sidebar-sparkle-right" />

            <Grid item xs={11} md={8} lg={7} xl={6} sx={{ zIndex: 3 }}>
              <Grid
                container
                direction="row"
                justifyContent={{ xs: "center", sm: "space-between" }}
                alignItems="center"
                sx={{ marginTop: "12px" }}
                columnGap={4}
              >
                <RecordShopTitle textColour={COLOURS.text} />

                <AboutUsPopover pageClassName={PAGE_CLASS} />
              </Grid>

              <Typography sx={{ marginTop: "12px", color: COLOURS.text }}>
                Effortlessly generate a playlist within seconds featuring the top tracks from each artist performing at
                the Laketown Shakedown 2024 music festival.
              </Typography>

              <PreviewPlaylist playlistUrl={SAMPLE_PLAYLIST_URL} />
            </Grid>
          </Grid>

          <Grid container justifyContent="center" className="phillips-background-icons background-bottom">
            <Grid item xs={11} md={8} lg={7} xl={6} sx={{ zIndex: 3, marginBottom: "130px" }}>
              <Grid
                container
                justifyContent={{ xs: "center", sm: "space-between" }}
                alignItems="flex-start"
                sx={{ marginTop: "24px" }}
                columnGap={2}
              >
                <Grid item style={{ maxWidth: "325px" }}>
                  <img src={laketownShakedownLogo} alt="Music Festival Logo" style={{ width: "100%" }} />
                  <Button
                    className="secondary-button"
                    onClick={() => goToNewTab(TICKET_LINK)}
                    variant="outlined"
                    sx={{ width: "160px", margin: "12px 0" }}
                  >
                    Buy Tickets
                  </Button>
                </Grid>

                {/* // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard */}
                <Grid item style={{ display: "grid", alignSelf: "stretch" }} width={{ xs: "100%", sm: "auto" }}>
                  <div style={{ justifySelf: "center", alignSelf: "center" }}>
                    {isLoggedIntoSpotify() ? (
                      <ProfileMenu />
                    ) : (
                      <SignInButton redirectToAuth={redirectToAuthForBrowser(openInAppModal)} />
                    )}
                  </div>
                  <IconButton
                    sx={{ marginLeft: "8px", justifySelf: "end", marginTop: "12px", color: "white", alignSelf: "end" }}
                    onClick={() => (isSettingsOpen ? closeSettings() : openSettings())}
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

              <StickyFadeButton
                bgFadeColourHex={COLOURS.stickyFadeButtonBgColour}
                button={
                  isMobile() && !isLoggedIntoSpotify() ? (
                    <SignInButton redirectToAuth={redirectToAuthForBrowser(openInAppModal)} />
                  ) : (
                    <CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />
                  )
                }
              />

              <InAppModal isOpen={isInAppModalOpen} closeModal={closeInAppModal} pageClassName={PAGE_CLASS} />
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};
