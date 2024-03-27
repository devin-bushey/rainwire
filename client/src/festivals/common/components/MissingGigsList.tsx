import { Box, CardMedia } from "@mui/material";
import { MISSING_COLOURS } from "../../../Rifflandia/constants/colours";
import { Playlist } from "../types/Playlist";
import { GigList } from "./GigList";
import { Gig } from "../types/Gig";

export const MissingGigsList = ({ playlist, missingTracks }: { playlist: Playlist; missingTracks: Gig[] }) => (
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
          <GigList gigs={missingTracks} cardColours={MISSING_COLOURS} playlistId={playlist.id} />
        )}
        <p>End of missing tracks</p>
      </Box>
    </Box>
  </>
);
