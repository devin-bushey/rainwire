import { Box, CardMedia } from "@mui/material";

import { Cities } from "../../constants/enums";
import { useTicketsQuery } from "../common/hooks/useTicketsQuery";
import { MISSING_COLOURS, RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../../Rifflandia/constants/colours";
import { TicketContainer } from "../common/components/TicketContainer";
import { usePlaylistQuery } from "../common/hooks/usePlaylistQuery";
import useSpotifyAuth from "../../hooks/useSpotifyAuth";
import { useMissingTracks } from "../common/hooks/useMissingTracks";

export const SampleFestival = () => {
  const { token, spotifyInfo } = useSpotifyAuth();
  const { data: gigs } = useTicketsQuery(Cities.Victoria);
  const { data: playlist } = usePlaylistQuery(token, spotifyInfo.user_id, "record shop victoria");
  const missingTracks = useMissingTracks(playlist, gigs);

  const PlaylistInfo = () => {
    if (playlist) {
      return (
        <>
          <Box>
            <p>PLAYLIST FOUND!!!!</p>
            <p>ID: {playlist.id}</p>
            <p>Name: {playlist.name}</p>
            <CardMedia
              component="img"
              sx={{
                display: "inline-block",
                width: 60,
                height: 60,
                marginRight: "12px",
              }}
              image={playlist.image.url}
              alt="Playlist"
            />
            <Box>
              <p>Missing Tracks:</p>
              {missingTracks.length > 0 && (
                <TicketContainer
                  tickets={missingTracks}
                  cardColours={MISSING_COLOURS}
                  token={token}
                  playlistId={playlist.id}
                />
              )}
              <p>End of missing tracks</p>
            </Box>
          </Box>
        </>
      );
    }
    return <></>;
  };

  return (
    <>
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
        <Box sx={{ maxWidth: "900px" }}>
          <PlaylistInfo />
          <TicketContainer tickets={gigs} cardColours={RIFF_CARD_COLOURS} />
        </Box>
      </Box>
    </>
  );
};
