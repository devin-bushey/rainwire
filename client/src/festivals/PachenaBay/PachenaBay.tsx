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
import backgroundSwirls from "./assets/backgroundSwirls.png";
import "./pachenaBayStyles.css";

const DB_COLLECTION_NAME = Festivals.PachenaBay;

const PLAYLIST_NAME = "Record Shop Pachena Bay 2024";
const TICKET_LINK = WEBSITE_PACHENA_BAY;

const COLOURS = Object.freeze({
  pageBackground: "#3B6AB3",
  text: "#FCFCFC",
  description: {
    background: "#00223C",
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
    background: RIFFLANDIA_COLOURS.light_blue_opaque,
    backgroundHover: RIFFLANDIA_COLOURS.dark_blue,
    text: "rgba(3, 49, 46, 0.8)",
  },
  settingsBackground: RIFFLANDIA_COLOURS.fill_pale_green,
  stickyButtonBackground: RIFFLANDIA_COLOURS.fill_light_orange,
  cardColours: RIFF_CARD_COLOURS,
});

const SECONDARY_BUTTON_SX = {
  backgroundColor: COLOURS.secondaryButton.background,
  ":hover": {
    backgroundColor: COLOURS.secondaryButton.backgroundHover,
  },
  color: COLOURS.secondaryButton.text,
};

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
        // backgroundColor: COLOURS.pageBackground,
      }}
    >
      <Grid
        container
        justifyContent="center"
        // sx={{
        //   backgroundImage: `url(${backgroundSwirls})`,
        //   backgroundSize: "cover",
        // }}
      >
        <div className="sidebar sidebar-coral-left" />
        <div className="sidebar sidebar-coral-right" />

        <Grid item xs={11} sm={10} md={7}>
          <RecordShopTitle textColour={COLOURS.text} />

          <Description />

          {!isLoggedIntoSpotify() ? (
            // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard
            // TODO: make this button work for in-app
            <SignInButton redirectToAuth={redirectToAuth} colours={COLOURS.primaryButton} />
          ) : (
            <Button variant="contained" onClick={logOut}>
              Sign Out
            </Button>
          )}
          {/* {playlist && <MissingGigsList playlist={playlist} missingTracks={missingTracks} />}
      <GigList gigs={gigs} cardColours={RIFF_CARD_COLOURS} /> */}

          <PreviewPlaylist />
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="center"
        sx={{ backgroundImage: `url(${backgroundSwirls})`, backgroundSize: "cover" }}
      >
        <Grid item xs={11} sm={10} md={7}>
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

const Description = () => (
  <Card
    sx={{
      backgroundColor: COLOURS.description.background,
      color: COLOURS.description.text,
      margin: "24px 0",
    }}
  >
    <Typography sx={{ marginTop: "12px" }}>
      Effortlessly generate a playlist within seconds featuring the top tracks from each artist performing at Pachena
      Bay.
    </Typography>

    <Typography sx={{ marginTop: "24px" }}>
      The playlist can be pre-populated and created right on your account!
    </Typography>
  </Card>
);

const PreviewPlaylist = () => (
  <Box
    sx={{
      margin: "24px 0",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Card
      sx={{
        backgroundColor: COLOURS.description.background,
        color: COLOURS.description.text,
        maxWidth: "70%",
      }}
    >
      <Typography>Not sure where to start? We&#39;ve created a public playlist for you to check out!</Typography>

      <Button
        onClick={() => goToNewTabOnDesktop("https://open.spotify.com/playlist/0v9ue8L0rG6OqxKc2hbAZh")}
        variant="outlined"
        sx={{
          ...SECONDARY_BUTTON_SX,
          width: "230px",
          marginTop: "12px",
          justifyContent: "center",
          height: "36px",
        }}
      >
        <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: "700",
            paddingBottom: 0,
          }}
        >
          Preview a Playlist
        </Typography>
      </Button>
    </Card>
  </Box>
);
