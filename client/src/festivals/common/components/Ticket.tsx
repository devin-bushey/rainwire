import { Card, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import { addTrackToPlaylist } from "../apiManager/addTrackToPlaylist";

export const Ticket = (props: any) => (
  <Card
    sx={{
      backgroundColor: props.bgcolor,
      width: "300px",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ alignItems: "center", textAlign: "left" }}>
        <Box>
          <Typography>{props.ticket.sp_band_name}</Typography>
        </Box>

        {props.ticket.isMissing && (
          <Button
            onClick={() => addTrackToPlaylist(props.token, props.playlistId, props.ticket.topTrack)}
            variant="contained"
          >
            Add
          </Button>
        )}
      </Box>
    </Box>
  </Card>
);
