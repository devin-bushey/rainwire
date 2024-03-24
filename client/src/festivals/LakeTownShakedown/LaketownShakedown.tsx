import "../../styles/ClickMe.css";
import "./styles.css";

import { Box, CardMedia, Container } from "@mui/material";

import { Cities } from "../../constants/enums";
import { useLoadingAndError } from "../common/hooks/useLoadingState";
import { useTicketsQuery } from "../common/hooks/useTicketsQuery";
import { useTicketsState } from "../common/hooks/useTicketState";
import { LoadingRifflandia } from "../../Rifflandia/LoadingRifflandia";
import { Spinner } from "../../Rifflandia/Spinner";
import { MISSING_COLOURS, RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../../Rifflandia/constants/colours";
import { TicketContainer } from "../common/components/TicketContainer";
import { usePlaylistQuery } from "../common/hooks/usePlaylistQuery";
import { useState, useEffect } from "react";

export const LaketownShakedown = () => {
  const LOAD_INTERVAL = 40;

  const query = useTicketsQuery(Cities.Victoria);
  const { isLoading, isError } = useLoadingAndError(query);
  const { tickets } = useTicketsState(query, LOAD_INTERVAL);
  const playlist = usePlaylistQuery("test");

  const [missingTracks, setMissingTracks] = useState([]);

  function extractTrackIds(trackArray: any) {
    return trackArray.map((track: any) => {
      const parts = track.uri.split(":");
      return "spotify:track:" + parts[parts.length - 1];
    });
  }

  useEffect(() => {
    const findMissingTracks = () => {
      if (!playlist.data) return;

      const missingTracks: any = [];

      const trackIds = extractTrackIds(playlist.data.tracks);
      const playlistTracks = new Set(trackIds);

      tickets.forEach((ticket: any) => {
        if (!playlistTracks.has(ticket.topTrackURIs[0])) {
          ticket.isMissing = true;
          ticket.topTrack = ticket.topTrackURIs[0];
          missingTracks.push(ticket);
        }
      });

      setMissingTracks(missingTracks);
    };

    findMissingTracks();
  }, [playlist.data, tickets]);

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
                  isLoadingTickets={false}
                  isErrorTickets={false}
                  cardColours={MISSING_COLOURS}
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

  if (isLoading) {
    return <LoadingRifflandia />;
  }

  return (
    <>
      {isLoading && <Spinner />}

      <Box
        className="riff-background"
        sx={{
          textAlign: "center",
          paddingBottom: "24px",
          backgroundColor: RIFFLANDIA_COLOURS.background,
        }}
      >
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
                  backgroundColor: RIFFLANDIA_COLOURS.background,
                  borderRadius: "10px",
                  width: "300px",
                  margin: "8px",
                }}
              >
                LakeTown Shakedown
              </Box>

              <PlaylistInfo />

              <TicketContainer
                tickets={tickets}
                isLoadingTickets={false}
                isErrorTickets={isError}
                cardColours={RIFF_CARD_COLOURS}
              />
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
};
