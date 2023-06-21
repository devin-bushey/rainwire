import { Button, Typography } from '@mui/material';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import './styles/ClickMe.css';

export const CreatePlaylistButton = ({
  handleCreatePlaylist,
  backgroundColor,
  hoverColor,
}: {
  handleCreatePlaylist: any;
  backgroundColor: string;
  hoverColor: string;
}) => {
  return (
    <Button
      onClick={handleCreatePlaylist}
      variant="contained"
      className="btn--click-me-riff create-playlist"
      sx={{
        backgroundColor: backgroundColor,
        ':hover': {
          backgroundColor: hoverColor,
        },
        color: 'black',
        width: '300px',
        //marginBottom: '24px',
        justifyContent: 'center',
        height: '48px',
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
      <Typography sx={{ paddingBottom: 0 }}>Generate playlist</Typography>
    </Button>
  );
};
