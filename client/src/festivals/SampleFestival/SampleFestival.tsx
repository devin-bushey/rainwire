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

  const tickets = useTicketsQuery(Cities.Victoria);
  const playlist = usePlaylistQuery(token, spotifyInfo.user_id, "test");
  const missingTracks = useMissingTracks(playlist.data, tickets.data);

  const PlaylistInfo = () => {
    if (playlist.data) {
      return (
        <>
          <Box>
            <p>PLAYLIST FOUND!!!!</p>
            <p>ID: {playlist.data.id}</p>
            <p>Name: {playlist.data.name}</p>
            <CardMedia
              component="img"
              sx={{
                display: "inline-block",
                width: 60,
                height: 60,
                marginRight: "12px",
              }}
              image={playlist.data.image.url}
              alt="Playlist"
            />
            <Box>
              <p>Missing Tracks:</p>
              {missingTracks.length > 0 && (
                <TicketContainer
                  tickets={missingTracks}
                  cardColours={MISSING_COLOURS}
                  token={token}
                  playlistId={playlist.data.id}
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
          <TicketContainer tickets={tickets.data} cardColours={RIFF_CARD_COLOURS} />
        </Box>
      </Box>
    </>
  );
};
