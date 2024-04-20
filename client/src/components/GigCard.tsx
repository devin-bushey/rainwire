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
          position: "relative",
          backgroundColor: bgcolor,
          maxWidth: "400px",
          width: "100%",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: "0",
        }}
        onClick={() => setSpotifyPreviewArtistId(gig.artist.id)}
      >
        <SpotifyLogoLong />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "4px",
          }}
        >
          <SpotifyAlbumArt image={gig.artist.albumArtUrl} />
          <Box sx={{ alignItems: "center", textAlign: "left" }}>
            <SpotifyGigName name={gig.artist.name} />
            <Description gig={gig} />
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "5px",
            left: "50%", // Center the box horizontally
            transform: "translateX(-50%)", // Move the box back to the left by 50% of its width
          }}
        >
          <Typography
            sx={{
              fontSize: "0.6rem",
            }}
          >{`(click me for a preview)`}</Typography>
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
      <Typography sx={{ fontSize: "16px", fontWeight: "700" }}>{name}</Typography>
    </div>
  );
};

const Description = ({ gig }: { gig: Gig }) => {
  const dateUnformatted = new Date(gig.date);
  const date = dateUnformatted.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
        {date} at {gig.venue}
      </Typography>
    </Box>
  );
};
