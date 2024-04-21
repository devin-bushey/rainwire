import { Box, Button, Collapse, Grid, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Festivals } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { useAuth } from "../../context/AuthContext";
import { setDocumentTitle } from "../../hooks/useDocumentTitleEffect";
import { SignInButton } from "../../components/SignInButton";
import { RecordShopTitle } from "../../components/RecordShopTitle";
import { AboutUsPopover } from "../../components/AboutUsPopover";
import { ProfileMenu } from "../../components/ProfileMenu";
import { goToNewTab } from "../../utils/browserUtils";
import { PageClassName, SpotifyColour } from "../../theme/AppStyles";
import { GigList } from "../../components/GigList";
import { redirectToAuthForBrowser } from "../../utils/spotifyAuthUtils";
import { useSettingsState } from "../../hooks/useSettingsCollapseState";
import { Settings } from "../../components/Settings";
import { StickyFadeButton } from "../../components/StickyFadeButton";
import { Spinner } from "../../components/Spinner";
import { CreatePlaylistButton } from "../../components/CreatePlaylistButton";
import { isMobile } from "../../utils/responsiveUtils";
import { useCreatePlaylistState } from "../../hooks/useCreatePlaylistState";
import phillipsBackyardLogo from "./assets/phillipsBackyardLogo.png";
import { InAppModal } from "../../components/InAppModal";
import { useInAppModalState } from "../../hooks/useInAppModalState";
import "./phillipsBackyardStyles.css";
import { PreviewPlaylist } from "../../components/PreviewPlaylist";

const DB_COLLECTION_NAME = Festivals.PhillipsBackyard2024;

const SAMPLE_PLAYLIST_URL = "https://open.spotify.com/playlist/3tW12mqnoqXIHLC3ZTSqJP";
const TICKET_LINK = "https://www.showpass.com/o/phillips-brewery/";

const PAGE_CLASS = PageClassName.PhillipsBackyard2024;

const COLOURS = Object.freeze({
  text: "#FFFFFF",
  cardColours: ["#f97fb3", "#fedf21", "#49a7c4", "#f37144"],
  stickyFadeButtonBgColour: "#f39934",
  spotifyIcons: {
    primary: SpotifyColour.White,
  },
});

export const PhillipsBackyard2024 = () => {
  const { isLoggedIntoSpotify } = useAuth();
  const { data: gigs, isLoading: isGigsQueryLoading } = useGigsQuery(DB_COLLECTION_NAME);
  const { isSettingsOpen, openSettings, closeSettings, numTopTracks, setNumTopTracks } = useSettingsState();
  const { isInAppModalOpen, openInAppModal, closeInAppModal } = useInAppModalState();

  const { isCreatingPlaylist, handleCreatePlaylist } = useCreatePlaylistState({
    dbCollectionName: DB_COLLECTION_NAME,
    numTopTracks,
  });

  setDocumentTitle("Record Shop | Phillips Backyard 2024");

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
                the Phillips Backyard 2024 events.
              </Typography>

              <PreviewPlaylist playlistUrl={SAMPLE_PLAYLIST_URL} pageClassName={PAGE_CLASS} />
            </Grid>
          </Grid>

          <Grid container justifyContent="center" className="background-bottom">
            <div className="phillips-background-icons" />

            <Grid item xs={11} md={8} lg={7} xl={6} sx={{ zIndex: 3, marginBottom: "130px" }}>
              <Grid
                container
                justifyContent={{ xs: "center", sm: "space-between" }}
                alignItems="flex-start"
                sx={{ marginTop: "48px" }}
                columnGap={2}
              >
                <Grid item style={{ maxWidth: "325px" }}>
                  <div>
                    <img src={phillipsBackyardLogo} alt="Phillips Backyard Logo" style={{ maxWidth: "300px" }} />
                  </div>
                  <Button
                    className="secondary-button"
                    onClick={() => goToNewTab(TICKET_LINK)}
                    variant="outlined"
                    sx={{ width: "200px", margin: "12px 0" }}
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
                      <SignInButton
                        redirectToAuth={redirectToAuthForBrowser(openInAppModal)}
                        iconColour={COLOURS.spotifyIcons.primary}
                      />
                    )}
                  </div>
                  <IconButton
                    sx={{
                      marginLeft: "8px",
                      justifySelf: "end",
                      marginTop: "12px",
                      color: "white",
                      alignSelf: "end",
                    }}
                    onClick={() => (isSettingsOpen ? closeSettings() : openSettings())}
                  >
                    <SettingsIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>

              <Collapse in={isSettingsOpen} collapsedSize={0}>
                <Settings
                  numTopTracks={numTopTracks}
                  setNumTopTracks={setNumTopTracks}
                  iconColour={COLOURS.spotifyIcons.primary}
                />
              </Collapse>

              <Box margin="24px 0">
                <GigList gigs={gigs} isQueryLoading={isGigsQueryLoading} cardColours={COLOURS.cardColours} />
              </Box>

              <StickyFadeButton
                bgFadeColourHex={COLOURS.stickyFadeButtonBgColour}
                button={
                  isMobile() && !isLoggedIntoSpotify() ? (
                    <SignInButton
                      redirectToAuth={redirectToAuthForBrowser(openInAppModal)}
                      iconColour={COLOURS.spotifyIcons.primary}
                    />
                  ) : (
                    <CreatePlaylistButton
                      handleCreatePlaylist={handleCreatePlaylist}
                      iconColour={COLOURS.spotifyIcons.primary}
                    />
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
