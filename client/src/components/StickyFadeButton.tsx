import { useState, useEffect } from "react";
import { CreatePlaylistButton } from "./CreatePlaylistButton";
import { Box } from "@mui/material";

export const StickyFadeButton = ({
  handleCreatePlaylist,
  bgFadeColourHex,
}: {
  handleCreatePlaylist: () => void;
  bgFadeColourHex: string;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowButton(scrollPosition >= 200);
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
          zIndex: 9,
          opacity: showButton ? 1 : 0,
          visibility: showButton ? 1 : "hidden",
          transition: "visibility 1.5s, opacity 1.5s ease",
          padding: "24px",
          width: "100%",
          height: "20%",
          alignContent: "center",
          backgroundImage: `linear-gradient(${bgFadeColourHex}00, ${bgFadeColourHex})`,
        }}
      >
        {/* TODO: if mobile, show sign in button; if desktop, show create playlist button (cause tooltip doesn't make sense on mobile) */}
        <CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />
      </Box>
    </Box>
  );
};
