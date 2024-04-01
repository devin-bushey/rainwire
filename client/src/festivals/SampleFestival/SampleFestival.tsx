import { Box, Button } from "@mui/material";
import { Cities } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../../Rifflandia/constants/colours";
import { GigList } from "../../components/GigList";
import { usePlaylistQuery } from "../../hooks/usePlaylistQuery";
import { useMissingTracks } from "../../hooks/useMissingTracks";
import { MissingGigsList } from "../../components/MissingGigsList";
import { useAuth } from "../../context/AuthContext";

/** UPDATE THESE CONSTANTS */
const FESTIVAL_ENUM = Cities.Victoria;
const PLAYLIST_NAME = "Record Shop test";

export const SampleFestival = () => {
  const { isLoggedIntoSpotify, redirectToAuth, logOut } = useAuth();
  const { data: gigs } = useGigsQuery(FESTIVAL_ENUM);
  const { data: playlist } = usePlaylistQuery(PLAYLIST_NAME);
  const missingTracks = useMissingTracks(playlist, gigs);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        textAlign: "center",
        paddingBottom: "24px",
        backgroundColor: RIFFLANDIA_COLOURS.background,
      }}
    >
      {!isLoggedIntoSpotify() ? (
        // TODO: Temp redirect - have to add actaul url to allow list in spotify dev dashboard
        <Button variant="contained" onClick={() => redirectToAuth()}>
          Sign In
        </Button>
      ) : (
        <Button variant="contained" onClick={logOut}>
          Sign Out
        </Button>
      )}
      {/* {playlist && <MissingGigsList playlist={playlist} missingTracks={missingTracks} />}
      <GigList gigs={gigs} cardColours={RIFF_CARD_COLOURS} /> */}
    </Box>
  );
};
