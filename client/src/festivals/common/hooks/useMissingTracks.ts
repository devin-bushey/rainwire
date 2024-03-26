import { useEffect, useState } from "react";

export const useMissingTracks = (playlistData: any, tickets: any) => {
  const [missingTracks, setMissingTracks] = useState([]);

  useEffect(() => {
    const findMissingTracks = () => {
      if (!playlistData) return;

      const missingTracks: any = [];

      const trackIds = playlistData.tracks;
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
  }, [playlistData, tickets]);

  return missingTracks;
};
