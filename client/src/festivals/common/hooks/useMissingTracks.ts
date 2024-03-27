import { useEffect, useState } from "react";
import { Playlist } from "../types/Playlist";
import { Gig } from "../types/Gig";

export const useMissingTracks = (playlist?: Playlist, gigs?: Gig[]) => {
  const [missingTracks, setMissingTracks] = useState<Gig[]>([]);

  useEffect(() => {
    const findMissingTracks = () => {
      const missingTracks: Gig[] = [];

      if (!playlist || !gigs) return missingTracks;

      const trackIds = playlist.tracks;
      const playlistTracks = new Set(trackIds);

      gigs.forEach((gig: Gig) => {
        // TODO: Use this -> if (!playlistTracks.has(gig.artist.topTracks[0])) {
        if (!playlistTracks.has(gig.topTrackURIs[0])) {
          gig.isMissing = true;
          missingTracks.push(gig);
        }
      });

      setMissingTracks(missingTracks);
    };

    findMissingTracks();
  }, [playlist, gigs]);

  return missingTracks;
};
