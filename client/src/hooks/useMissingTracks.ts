import { useEffect, useState } from "react";
import { Playlist } from "../types/Playlist";
import { Gig } from "../types/Gig";

export const useMissingTracks = (playlist?: Playlist, gigs?: Gig[]) => {
  const [missingTracks, setMissingTracks] = useState<Gig[]>([]);

  useEffect(() => {
    const findMissingTracks = () => {
      const missingTracks: Gig[] = [];

      if (!playlist || !gigs) return missingTracks;

      const playlistTracks = playlist.tracks.map((track: any) => track.uri);

      gigs.forEach((gig: Gig) => {
        if (!playlistTracks.includes(gig.artist.topTracks[0])) {
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
