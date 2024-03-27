import { Box, Button } from "@mui/material";
import { Cities } from "../../constants/enums";
import { useGigsQuery } from "../common/hooks/useGigsQuery";
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../../Rifflandia/constants/colours";
import { GigList } from "../common/components/GigList";
import { usePlaylistQuery } from "../common/hooks/usePlaylistQuery";
import { useMissingTracks } from "../common/hooks/useMissingTracks";
import { MissingGigsList } from "../common/components/MissingGigsList";
import { useAuth } from "../../context/AuthContext";

export const SampleFestival = () => {
  const { isLoggedIntoSpotify, redirectToAuth, logOut } = useAuth();
  const { data: gigs } = useGigsQuery(Cities.Victoria); // TODO: change Cities.Victoria to the actual festival enum
  const { data: playlist } = usePlaylistQuery("test"); // TODO: change 'test' to 'record shop {festival name}'
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
      {playlist && <MissingGigsList playlist={playlist} missingTracks={missingTracks} />}
      <GigList gigs={gigs} cardColours={RIFF_CARD_COLOURS} />
    </Box>
  );
};
