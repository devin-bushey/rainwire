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
    disableAutoFocus={true}
    className="artist-bio-modal"
  >
    <Box
      className={"scroll-style"}
      sx={{
        position: "absolute",
        width: "92%",
        maxWidth: 600,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        border: 0,
        borderRadius: "10px",
        backgroundColor: DEFAULT_BACKGROUND_COLOUR,
        padding: "24px",
        maxHeight: "70%",
        overflowY: "scroll",
      }}
    >
      <Box>
        <Typography fontSize="24px" fontWeight="bold">
          {artistBio?.name}
        </Typography>
        <Typography>{artistBio?.bio}</Typography>
      </Box>
    </Box>
  </Modal>
);
