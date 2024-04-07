import { Modal, Box } from "@mui/material";

type SpotifyPreviewModalProps = {
  artistId?: string;
  setArtistId: (artistUrl?: string) => void;
};

export const SpotifyPreviewModal = ({ artistId, setArtistId: setArtistUrl }: SpotifyPreviewModalProps) => (
  <Modal
    open={!!artistId}
    onClose={() => setArtistUrl(undefined)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    disableAutoFocus={true}
  >
    <Box
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
      }}
    >
      <iframe
        title="spotifyPreviewModal"
        src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator`}
        width="92%"
        height="450px"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </Box>
  </Modal>
);
