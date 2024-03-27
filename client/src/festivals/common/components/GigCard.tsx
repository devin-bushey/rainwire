import { Card, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import { addTrackToPlaylist } from "../apiManager/addTrackToPlaylist";
import { Gig } from "../types/Gig";
import { useAuth } from "../../../context/AuthContext";

export const GigCard = ({ gig, playlistId, bgcolor }: { gig: Gig; playlistId?: string; bgcolor: string }) => {
  const { token } = useAuth();

  return (
    <Card
      sx={{
        backgroundColor: bgcolor,
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
            <Typography>{gig.sp_band_name}</Typography>
          </Box>

          {gig.isMissing && playlistId && (
            <Button onClick={() => addTrackToPlaylist(token, playlistId, gig.topTrackURIs[0])} variant="contained">
              Add
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};
