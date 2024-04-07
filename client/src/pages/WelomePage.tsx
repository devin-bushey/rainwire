import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import { COLOURS } from "../theme/AppStyles";
import spotifyLogo from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from "../constants/auth";
import { InAppModal } from "../components/InAppModal";
import "../styles/Background.css";
import { Link } from "react-router-dom";

import { goToNewTabOnDesktop, isInAppBrowser, scrollToTop } from "../utils/browserUtils";
import { useAuth } from "../context/AuthContext";
import { setDocumentTitle } from "../hooks/useDocumentTitleEffect";
import { useInAppModalState } from "../hooks/useInAppModalState";
import { redirectToAuth, redirectToAuthForBrowser } from "../utils/spotifyAuthUtils";

const WelcomePage = memo(() => {
  const { isLoggedIntoSpotify } = useAuth();
  const { isInAppModalOpen, openInAppModal, closeInAppModal } = useInAppModalState();

  setDocumentTitle("Record Shop | Login");

  return (
    <>
      <div className="spacer layer"></div>
      <Container maxWidth="lg" sx={{ marginTop: "-24px" }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: "5rem",
            fontFamily: "Lobster, Arial, sans-serif",
            letterSpacing: "2px",
          }}
        >
          Record Shop
        </Typography>
        <Typography
          sx={{
            color: COLOURS.blue,
            fontWeight: "700",
            fontSize: "1.7rem",
            paddingTop: "8px",
          }}
        >
          Discover new music.
        </Typography>

        <Box
          sx={{
            width: "81%",
            maxWidth: "700px",
            "& .MuiTypography-body1": {
              fontSize: "1.25rem",
            },
          }}
        >
          <Typography sx={{ paddingTop: "12px" }}>
            Create personalized Spotify playlists with the top tracks from artists performing in your city or festival
            of choice.
          </Typography>

          {!isLoggedIntoSpotify() && (
            <Typography sx={{ paddingTop: "12px" }}>To get started, sign in with Spotify.</Typography>
          )}
        </Box>

        {!isLoggedIntoSpotify() && (
          <>
            <Box display="flex" flexDirection="column">
              <Button
                onClick={redirectToAuthForBrowser(openInAppModal, `${BASE_REDIRECT_URI}artists`)}
                variant="contained"
                sx={{
                  backgroundColor: COLOURS.blue,
                  ":hover": {
                    backgroundColor: COLOURS.card_colours[0],
                  },
                  color: "black",
                  width: "300px",
                  marginTop: "24px",
                  marginBottom: "16px",
                  justifyContent: "center",
                  height: "48px",
                }}
              >
                <img
                  src={spotifyLogo}
                  alt="spotify_logo"
                  width="20px"
                  height="20px"
                  style={{ marginRight: "8px", marginBottom: "3px" }}
                />
                Sign in with Spotify
              </Button>
            </Box>

            <Box
              sx={{
                width: "75%",
                maxWidth: "700px",
                "& .MuiTypography-body1": {
                  fontSize: "1rem",
                },
                marginTop: "16px",
              }}
            >
              <Typography sx={{ paddingTop: "12px" }}>Don&apos;t want to sign in?</Typography>
            </Box>
          </>
        )}

        {isLoggedIntoSpotify() && (
          <Box display="flex" flexDirection="column">
            <Box
              sx={{
                width: "75%",
                maxWidth: "700px",
                "& .MuiTypography-body1": {
                  fontSize: "1rem",
                },
                marginTop: "16px",
              }}
            >
              <Typography sx={{ paddingTop: "12px" }}>
                Create a playlist based on artists playing at upcoming local events
              </Typography>
            </Box>
            <Button
              component={Link}
              to={"/artists"}
              variant="outlined"
              sx={{
                marginTop: "4px",
                marginBottom: "8px",
                padding: "8px 16px",
                width: "300px",
              }}
            >
              Local Artists
            </Button>
            <Box
              sx={{
                width: "75%",
                maxWidth: "700px",
                "& .MuiTypography-body1": {
                  fontSize: "1rem",
                },
                marginTop: "16px",
              }}
            >
              <Typography sx={{ paddingTop: "12px" }}>Or feel free to ...</Typography>
            </Box>
          </Box>
        )}

        <Button
          onClick={() => goToNewTabOnDesktop("https://open.spotify.com/user/31ma23i46a3p3vmxvvq7qmhk7w3q")}
          variant="outlined"
          sx={{
            marginTop: "4px",
            marginBottom: "8px",
            padding: "8px 16px",
            width: "300px",
          }}
        >
          <img src={spotifyLogo} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
          Preview a Playlist
        </Button>
        <Box
          style={{
            maxWidth: "700px",
            fontSize: "0.7rem",
            marginTop: "4px",
            marginBottom: "48px",
          }}
        >
          (but its more fun to customize your own)
        </Box>

        <InAppModal
          isOpen={isInAppModalOpen}
          closeModal={closeInAppModal}
          postAuthRedirectUri={`${BASE_REDIRECT_URI}artists`}
        />
      </Container>
    </>
  );
});

WelcomePage.displayName = "WelcomePage";

export default WelcomePage;
