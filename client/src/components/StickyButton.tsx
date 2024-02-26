import { useState, useEffect } from "react";
import { CreatePlaylistButton } from "./CreatePlaylistButton";
import { Box } from "@mui/material";

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
      setShowButton(scrollPosition >= 800);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          position: "fixed",
          bottom: "0px",
          //right: '16px',
          zIndex: 9,
          opacity: showButton ? 1 : 0,
          visibility: showButton ? 1 : "hidden",
          transition: "visibility 1.5s, opacity 1.5s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            width: "500px",
            borderRadius: "8px",
            backgroundColor: barColor,
            marginBottom: "24px",
          }}
        >
          <CreatePlaylistButton
            handleCreatePlaylist={handleCreatePlaylist}
            backgroundColor={backgroundColor}
            hoverColor={hoverColor}
          />
        </Box>
      </Box>
    </Box>
  );
};
