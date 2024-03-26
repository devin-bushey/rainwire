import { Card, Typography, CardMedia } from "@mui/material";
import { Box } from "@mui/system";
import spotifyLogoBlack from "../spotifyLogos/Spotify_Logo_RGB_Black.png";
import { RIFFLANDIA_COLOURS } from "./constants/colours";

type TicketProps = {
  ticket: any;
  image: string;
  bgcolor: string;
  setSpotifyPreviewArtist: (artistUrl: string) => void;
};

export const Ticket = ({ ticket, image, bgcolor, setSpotifyPreviewArtist }: TicketProps) => {
  const description = ticket.day ? `${ticket.day} at ${ticket.weekend}` : ticket.ticket_date;

  return (
    <Card
      sx={{
        backgroundColor: bgcolor,
        height: "150px",
        width: "300px",
        margin: "8px",
        "&:hover": {
          outline: `thick double ${RIFFLANDIA_COLOURS.dark_blue}`,
        },
      }}
    >
      <Box onClick={() => setSpotifyPreviewArtist(ticket.band_id)}>
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
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
          <Box sx={{ alignItems: "center", textAlign: "left" }}>
            <Typography
              sx={{
                fontWeight: "700",
                fontSize: "1rem",
                paddingBottom: 0,
              }}
            >
              {ticket.sp_band_name}
            </Typography>

            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "0.77rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "4",
                  WebkitBoxOrient: "vertical",
                  paddingBottom: "0px",
                  marginBottom: "8px",
                }}
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
