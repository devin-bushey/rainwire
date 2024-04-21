import { Modal, Box, Typography } from "@mui/material";
import { Artist } from "../types/Gig";

type BioModalProps = {
  artistBio?: Artist;
  setArtistBio: (artistBio?: Artist) => void;
};

const DEFAULT_BACKGROUND_COLOUR = "#2596be";

export const BioModal = ({ artistBio, setArtistBio }: BioModalProps) => (
  <Modal
    open={!!artistBio}
    onClose={() => setArtistBio(undefined)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    disableAutoFocus={true}
  >
    <Box
      className={"scroll-style"}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: 600,
        display: "flex",
        justifyContent: "center",
        border: 0,
        backgroundColor: DEFAULT_BACKGROUND_COLOUR,
        padding: "24px",
        maxHeight: "70%",
        overflowY: "scroll",
      }}
    >
      <Box>
        <Typography fontSize={"24px"}>{artistBio?.name}</Typography>
        <Typography>{artistBio?.bio}</Typography>
      </Box>
    </Box>
  </Modal>
);
