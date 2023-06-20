import { useState, useEffect } from 'react';
import { CreatePlaylistButton } from './CreatePlaylistButton';
import { Box } from '@mui/material';

export const StickyButton = ({
  handleCreatePlaylist,
  backgroundColor,
  hoverColor,
  barColor,
}: {
  handleCreatePlaylist: any;
  backgroundColor: string;
  hoverColor: string;
  barColor: string;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowButton(scrollPosition >= 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '0px',
        //right: '16px',
        zIndex: 9999,
        opacity: showButton ? 1 : 0,
        transition: 'opacity 0.5s ease',
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          width: '500px',
          borderRadius: '8px',
          backgroundColor: barColor,
          marginBottom: '24px',
        }}
      >
        <CreatePlaylistButton
          handleCreatePlaylist={handleCreatePlaylist}
          backgroundColor={backgroundColor}
          hoverColor={hoverColor}
        />
      </Box>
    </Box>
  );
};
