import { Modal, Box, Typography, Link } from "@mui/material";
import { Artist } from "../types/Gig";
import { PageClassName } from "../theme/AppStyles";

type BioModalProps = {
  artist?: Artist;
  setArtist: (artist?: Artist) => void;
  pageClassName?: PageClassName;
};

const DEFAULT_BACKGROUND_COLOUR = "#2596be";

export const BioModal = ({ artist, setArtist, pageClassName }: BioModalProps) => (
  <Modal open={!!artist} onClose={() => setArtist(undefined)} disableAutoFocus={true} className={pageClassName}>
    <Box
      className="scroll-style artist-bio"
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
          {artist?.name}
        </Typography>
        <SocialLinks artist={artist} />
        <Typography>{artist?.bio}</Typography>
      </Box>
    </Box>
  </Modal>
);

const SocialLinks = ({ artist }: { artist?: Artist }) => {
  if (!artist?.website && !artist?.instagram) return;

  return (
    <Box sx={{ marginBottom: "12px" }}>
      <Website website={artist?.website} />
      <Instagram instagram={artist?.instagram} />
    </Box>
  );
};

const Website = ({ website }: { website?: string }) => {
  if (!website) return;
  return (
    <Link href={website} underline="hover" rel="noopener" target="_blank" sx={{ marginRight: "12px" }}>
      Website
    </Link>
  );
};

const Instagram = ({ instagram }: { instagram?: string }) => {
  if (!instagram) return;
  return (
    <Link href={instagram} rel="noopener" target="_blank" underline="hover">
      Instagram
    </Link>
  );
};
