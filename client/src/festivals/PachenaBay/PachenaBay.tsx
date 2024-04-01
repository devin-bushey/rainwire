import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Cities, Festivals } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../../Rifflandia/constants/colours";
import { GigList } from "../../components/GigList";
import { usePlaylistQuery } from "../../hooks/usePlaylistQuery";
import { useMissingTracks } from "../../hooks/useMissingTracks";
import { MissingGigsList } from "../../components/MissingGigsList";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { goTo, goToNewTabOnDesktop, scrollToTop } from "../../utils/browserUtils";
import { setDocumentTitle } from "../../hooks/useDocumentTitleEffect";
import { WEBSITE_PACHENA_BAY } from "../../constants/locations";
import { Block } from "@mui/icons-material";
import { SignInButton } from "../../components/SignInButton";
import { RecordShopTitle } from "../../components/RecordShopTitle";
import spotifyIcon from "../../spotifyLogos/Spotify_Icon_RGB_Black.png";
import pachenaBayTextLogo from "./assets/pachenaBayTextLogo.png";
import "./pachenaBayStyles.css";
import { PreviewPlaylist } from "../../components/PreviewPlaylist";

const DB_COLLECTION_NAME = Festivals.PachenaBay;

const PLAYLIST_NAME = "Record Shop Pachena Bay 2024";
const TICKET_LINK = WEBSITE_PACHENA_BAY;

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
  const { data: playlist } = usePlaylistQuery(PLAYLIST_NAME);
  const missingTracks = useMissingTracks(playlist, gigs);

  setDocumentTitle("Record Shop | Pachena Bay");

  return (
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

        <Grid item xs={11} sm={10} md={6} sx={{ zIndex: 10 }}>
          <RecordShopTitle textColour={COLOURS.text} />

          <Typography sx={{ marginTop: "12px", color: COLOURS.text }}>
            Effortlessly generate a playlist within seconds featuring the top tracks from each artist performing at
            Pachena Bay.
          </Typography>

          {!isLoggedIntoSpotify() ? (
            // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard
            // TODO: make this button work for in-app
            <SignInButton redirectToAuth={redirectToAuth} className="primary-button" />
          ) : (
            <Button variant="contained" onClick={logOut}>
              Sign Out
            </Button>
          )}
          {/* {playlist && <MissingGigsList playlist={playlist} missingTracks={missingTracks} />}
      <GigList gigs={gigs} cardColours={RIFF_CARD_COLOURS} /> */}

          <PreviewPlaylist
            playlistUrl="https://open.spotify.com/playlist/0v9ue8L0rG6OqxKc2hbAZh"
            className="preview-playlist"
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item xs={11} sm={10} md={7} sx={{ zIndex: 3 }}>
          <Grid container sx={{ marginTop: "48px" }}>
            <Grid item xs={12} md={6}>
              <img src={pachenaBayTextLogo} alt="Pachena Bay Music Festival" width="100%" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
