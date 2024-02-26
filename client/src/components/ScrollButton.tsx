import { Button, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import chevronUp from "../assets/images/chevron-up-solid.svg";

export const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const listenToScroll = () => {
    const heightToHideFrom = 400;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      !isVisible && // to limit setting state only the first time
        setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("lg"));

  return isVisible ? (
    <Button
      key="to-top-button"
      aria-label="To Top"
      variant="contained"
      color="secondary"
      onClick={scrollToTop}
      sx={{
        position: "fixed",
        bottom: 57,
        right: matches ? 20 : 60,
        minWidth: "20px",
      }}
    >
      <img src={chevronUp} alt="scroll up" width="20px" height="20px" />
    </Button>
  ) : (
    <></>
  );
};
