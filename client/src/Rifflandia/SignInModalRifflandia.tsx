import { Modal, Box, Typography, Button } from "@mui/material";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { RIFFLANDIA_COLOURS } from "./constants/colours";

type SignInModalRifflandiaProps = {
  isOpen: boolean;
  closeModal: () => void;
  handleRedirectToAuth: () => void;
};

export const SignInModalRifflandia = ({ isOpen, closeModal, handleRedirectToAuth }: SignInModalRifflandiaProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 400,
          backgroundColor: RIFFLANDIA_COLOURS.fill_pale_green,
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ maxWidth: "70%", fontWeight: "700" }}>
          Please sign into your Spotify account then try again!
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleRedirectToAuth}
            variant="contained"
            sx={{
              width: "100%",
              marginTop: "12px",
              justifyContent: "center",
              backgroundColor: RIFFLANDIA_COLOURS.light_blue,
              ":hover": {
                backgroundColor: RIFFLANDIA_COLOURS.dark_blue,
              },
            }}
          >
            <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
            <Typography sx={{ paddingBottom: 0, color: "black" }}>Continue</Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
