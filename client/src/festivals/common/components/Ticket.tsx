import { Card, Typography, CardMedia, Button } from "@mui/material";
import { Box } from "@mui/system";
import spotifyLogoBlack from "../../../spotifyLogos/Spotify_Logo_RGB_Black.png";
import { useEffect, useRef, useState } from "react";
import { COLOURS, primaryButtonColours } from "../../../theme/AppStyles";
import { goToNewTabOnDesktop } from "../../../utils/browserUtils";
import { addTicketToExistingPlaylist } from "../apiManager/addTicket";
import useSpotifyAuth from "../../../hooks/useSpotifyAuth";

export const Ticket = (props: any) => {
  const description = props.ticket.day
    ? `${props.ticket.day} at ${props.ticket.weekend || props.ticket.venue}`
    : props.ticket.ticket_date;

  const containerRef = useRef<HTMLDivElement>(null);

  const { token, spotifyInfo } = useSpotifyAuth();

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const textElement = container.querySelector("span");

      if (textElement) {
        let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
        while (textElement.offsetHeight > 16) {
          fontSize -= 1;
          textElement.style.fontSize = fontSize + "px";
        }
      }
    }
  }, []);

  return (
    <Card
      sx={{
        backgroundColor: props.bgcolor,
        height: "200px",
        width: "300px",
        margin: "8px",
        "&:hover": {
          outline: `thick double ${COLOURS.primary_blue}`,
        },
      }}
    >
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
          image={props.image}
          alt="Album"
        />
        <Box sx={{ alignItems: "center", textAlign: "left" }}>
          <div ref={containerRef}>
            <span style={{ fontWeight: "700" }}>{props.ticket.sp_band_name}</span>
          </div>

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
          {props.ticket.isMissing && (
            <Button
              onClick={() => addTicketToExistingPlaylist(token, props.playlistId, props.ticket.topTrack)}
              variant="contained"
              sx={{
                ...primaryButtonColours,
                width: "150px",
                height: "48px",
                alignSelf: "center",
              }}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};
