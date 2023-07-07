import { Modal, Box, Typography, Button } from '@mui/material';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { RIFFLANDIA_COLOURS } from './constants/colours';
import { useContext } from 'react';
import { SnackBarContext } from '../App';
import copy from '../assets/images/copy-solid.svg';

export const InAppModalRifflandia = ({
  open,
  handleClose,
  handleRedirectToAuth,
}: {
  open: any;
  handleClose: any;
  handleRedirectToAuth: any;
}) => {
  const snackBar = useContext(SnackBarContext);

  const handleCopy = () => {
    navigator.clipboard.writeText('recordshop.cool/rifflandia');
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: 'Copied! Please paste URL in a new browser window',
      isError: false,
    });
  };
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
          backgroundColor: RIFFLANDIA_COLOURS.fill_pale_green,
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ maxWidth: '70%', fontWeight: '700' }}>
          Looks like you&apos;re using an in-app browser.
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          If you have trouble signing in with Spotify then please try again by opening Record Shop using Chrome, Safari,
          Firefox, etc.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <Button
            onClick={handleRedirectToAuth}
            variant="contained"
            sx={{
              width: '100%',
              marginTop: '12px',
              justifyContent: 'center',
              backgroundColor: RIFFLANDIA_COLOURS.light_blue,
              ':hover': {
                backgroundColor: RIFFLANDIA_COLOURS.dark_blue,
              },
            }}
          >
            <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
            <Typography sx={{ paddingBottom: 0, color: 'black' }}>Continue</Typography>
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
          <Typography sx={{ paddingBottom: '0px', fontSize: '14px' }}>https://recordshop.cool/rifflandia</Typography>
          <Button onClick={handleCopy} sx={{ minWidth: '20px' }}>
            <img src={copy} alt="copy" height="20px" />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
