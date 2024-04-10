import { Box, Collapse, Container, IconButton, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button/Button";
import { useState } from "react";
import { LOCATIONS } from "../constants/locations";
import { Origin } from "../components/Origin";
import { Settings } from "../components/Settings";
import { Spinner } from "../components/Spinner";
import { primaryButtonColours } from "../theme/AppStyles";
import { SpotifyIcon } from "../components/Icons";
import { isMobile } from "../utils/responsiveUtils";
import SettingsIcon from "@mui/icons-material/Settings";
import { useGigsQuery } from "../hooks/useGigsQuery";
import { useAuth } from "../context/AuthContext";
import { useShakingEffect } from "../hooks/useShakingEffect";
import { GigList } from "../components/GigList";
import { StickyFadeButton } from "../components/StickyFadeButton";
import { CreatePlaylistButton } from "../components/CreatePlaylistButton";
import { redirectToAuthForBrowser } from "../utils/spotifyAuthUtils";
import { SignInButton } from "../components/SignInButton";
import { InAppModal } from "../components/InAppModal";
import { useInAppModalState } from "../hooks/useInAppModalState";
import { useCreatePlaylistState } from "../hooks/useCreatePlaylistState";
import { setDocumentTitle } from "../hooks/useDocumentTitleEffect";
import { useSettingsState } from "../hooks/useSettingsCollapseState";

export const ArtistsPage = () => {
  const { isLoggedIntoSpotify, redirectToAuth } = useAuth();
  const { isInAppModalOpen, openInAppModal, closeInAppModal } = useInAppModalState();

  const [origin, setOrigin] = useState(LOCATIONS[0].value);
  const { data: gigs, isLoading: isGigsQueryLoading } = useGigsQuery(origin);
  const { isSettingsOpen, openSettings, closeSettings, numTopTracks, setNumTopTracks } = useSettingsState();
  const { isCreatingPlaylist, handleCreatePlaylist } = useCreatePlaylistState({
    city: origin,
    numTopTracks,
  });

  setDocumentTitle("Record Shop | Artists");

  const handleChangeOrigin = (event: any) => {
    setOrigin(event.target.value);
  };

  const PlaylistCreation = (
    <>
      <Box
        sx={{
          borderRadius: "10px",
          width: "300px",
          margin: "8px",
        }}
      >
        {isLoggedIntoSpotify() ? (
          <Box sx={{ display: "flex" }}>
            <CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />

            <IconButton
              sx={{ marginLeft: "8px" }}
              onClick={() => (isSettingsOpen ? closeSettings() : openSettings())}
              disableRipple={true}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        ) : isMobile() ? (
          <Button
            onClick={() => redirectToAuth()}
            variant="contained"
            sx={{
              ...primaryButtonColours,
              color: "black",
              width: "300px",
              marginBottom: "16px",
              justifyContent: "center",
              height: "48px",
            }}
          >
            {SpotifyIcon()}
            <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
          </Button>
        ) : (
          <Tooltip title="Sign in to unlock this feature!">
            <span>
              <Button
                variant="contained"
                sx={{
                  width: "300px",
                  marginBottom: "16px",
                  justifyContent: "center",
                  height: "48px",
                }}
                disabled
              >
                {SpotifyIcon()}
                <Typography sx={{ paddingBottom: 0, color: "grey" }}>Create playlist</Typography>
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      <Collapse in={isSettingsOpen} collapsedSize={0}>
        <Settings numTopTracks={numTopTracks} setNumTopTracks={setNumTopTracks} />
      </Collapse>
    </>
  );

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <Box sx={{ marginTop: "-24px", textAlign: "center", paddingBottom: "150px" }}>
        <Typography
          sx={{
            fontSize: "4rem",
            fontFamily: "Lobster, Arial, sans-serif",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Record Shop
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ maxWidth: "900px" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  borderRadius: "10px",
                  width: "300px",
                  margin: "8px",
                }}
              >
                <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />
              </Box>

              {PlaylistCreation}
            </Container>

            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                paddingTop: "24px",
              }}
            >
              <GigList gigs={gigs} isQueryLoading={isGigsQueryLoading} />
            </Container>
          </Box>
        </Box>
      </Box>

      <StickyFadeButton
        bgFadeColourHex="#CBCFE7"
        button={
          isMobile() && !isLoggedIntoSpotify() ? (
            <SignInButton redirectToAuth={redirectToAuthForBrowser(openInAppModal)} />
          ) : (
            <CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />
          )
        }
      />

      <InAppModal isOpen={isInAppModalOpen} closeModal={closeInAppModal} />
    </>
  );
};
