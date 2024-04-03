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
        padding: "0px 32px",
        marginTop: "48px",
        marginBottom: "32px",
        border: 0,
      }}
    >
      <iframe
        title="spotifyPreviewModal"
        src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator`}
        width="100%"
        height="600"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </Box>
  </Modal>
);
