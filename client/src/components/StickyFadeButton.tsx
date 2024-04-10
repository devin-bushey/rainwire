import { useState, useEffect } from "react";
import { Box } from "@mui/material";

export const StickyFadeButton = ({ bgFadeColourHex, button }: { bgFadeColourHex: string; button: JSX.Element }) => {
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
          visibility: showButton ? "visible" : "hidden",
          transition: "visibility 1.5s, opacity 1.5s ease",
          padding: "24px",
          width: "100%",
          height: "150px",
          alignContent: "center",
          textAlign: "center",
          backgroundImage: `linear-gradient(${bgFadeColourHex}00, ${bgFadeColourHex})`,
        }}
      >
        {button}
      </Box>
    </Box>
  );
};
