import { Box, Typography } from '@mui/material';
import React from 'react';
import spotifyLogo from '../spotifyLogos/Spotify_Logo_RGB_Black.png';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ marginTop: '16px' }}>
      {/* <Typography variant="body2" color="textSecondary" display="flex" align="center" justifyContent="center">
        Powered by <img src={spotifyLogo} alt="spotify_logo" width="75px" height="auto" style={{ marginLeft: '8px' }} />
      </Typography> */}
    </Box>
  );
};

export default Footer;
