import { Modal, Box, Typography, Button } from '@mui/material';
import spotifyIcon from '../../spotifyLogos/Spotify_Icon_RGB_Black.png';

export const InAppModalRifflandia = ({
  open,
  handleClose,
  handleRedirectToAuth,
}: {
  open: any;
  handleClose: any;
  handleRedirectToAuth: any;
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ maxWidth: '70%' }}>
          Looks like you&apos;re using an in-app browser.
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          If you have trouble signing in with Spotify then please try again by opening Record Shop with Chrome, Safari,
          Firefox, etc.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <Button
            onClick={handleRedirectToAuth}
            variant="contained"
            color="secondary"
            //className="btn--click-me"
            sx={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
          >
            <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
            <Typography sx={{ paddingBottom: 0 }}>Continue</Typography>
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <Typography sx={{ paddingBottom: '0px' }}>https://recordshop.cool/rifflandia</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <Button variant="outlined" onClick={() => navigator.clipboard.writeText('recordshop.cool/rifflandia')}>
            Copy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
