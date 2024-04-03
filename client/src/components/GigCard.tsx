import { Card, Typography, CardMedia } from "@mui/material";
import { Box } from "@mui/system";
import { Gig } from "../types/Gig";
import { useAdjustFontSize } from "../hooks/useAdjustFontSize";
import spotifyLogoBlack from "../spotifyLogos/Spotify_Logo_RGB_Black.png";
import { useState } from "react";
import { SpotifyPreviewModal } from "../Rifflandia/SpotifyPreviewModal";

export const GigCard = ({ gig, bgcolor }: { gig: Gig; bgcolor: string }) => {
  const [spotifyPreviewArtistId, setSpotifyPreviewArtistId] = useState<string | undefined>();

  return (
    <>
      <Card
        sx={{
          backgroundColor: bgcolor,
          width: "300px",
        }}
        onClick={() => setSpotifyPreviewArtistId(gig.artist.id)}
      >
        <SpotifyLogoLong />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SpotifyAlbumArt image={gig.artist.albumArtUrl} />
          <Box sx={{ alignItems: "center", textAlign: "left" }}>
            <SpotifyGigName name={gig.artist.name} />
            <Description gig={gig} />
          </Box>
        </Box>
      </Card>
      <SpotifyPreviewModal artistId={spotifyPreviewArtistId} setArtistId={setSpotifyPreviewArtistId} />
    </>
  );
};

const SpotifyLogoLong = () => (
  <Box sx={{ display: "flex", alignItems: "left" }}>
    <img
      src={spotifyLogoBlack}
      alt="spotify_logo"
      width="75px"
      height="22.48px"
      style={{ marginBottom: "12px" }}
      loading="lazy"
    />
  </Box>
);

const SpotifyAlbumArt = ({ image }: { image: string }) => (
  <CardMedia
    component="img"
    sx={{
      display: "inline-block",
      width: 60,
      height: 60,
      marginRight: "12px",
    }}
    image={image}
    alt="Album"
  />
);

const SpotifyGigName = ({ name }: { name: string }) => {
  const containerRef = useAdjustFontSize();
  return (
    <div ref={containerRef}>
      <span style={{ fontWeight: "700" }}>{name}</span>
    </div>
  );
};

const Description = ({ gig }: { gig: Gig }) => {
  const dateUnformatted = new Date(gig.date);
  const date = dateUnformatted.toISOString().split("T")[0];
  const description = `${date} at ${gig.venue}`;
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: "700",
          fontSize: "0.77rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "4",
          WebkitBoxOrient: "vertical",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
