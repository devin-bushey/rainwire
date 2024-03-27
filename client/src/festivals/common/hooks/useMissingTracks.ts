import { useEffect, useState } from "react";
import { Playlist } from "../types/Playlist";
import { Gig } from "../types/Gig";

export const useMissingTracks = (playlist?: Playlist, gigs?: Gig[]) => {
  if (!playlist || !gigs) return;

  const [missingTracks, setMissingTracks] = useState<Gig[]>([]);

  useEffect(() => {
    const findMissingTracks = () => {
      if (!playlist) return;

      const missingTracks: Gig[] = [];

      const trackIds = playlist.tracks;
      const playlistTracks = new Set(trackIds);

      gigs.forEach((gig: Gig) => {
        if (!playlistTracks.has(gig.artist.topTracks[0])) {
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
