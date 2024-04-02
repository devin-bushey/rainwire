import { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { ContactUsModal } from "./ContactUsModal";

export const AboutUsPopover = ({ globalClassName }: { globalClassName: string }) => {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const closePopover = () => setPopoverAnchor(null);

  const open = Boolean(popoverAnchor);

  return (
    <div className="about-us-popover">
      <Button variant="contained" onClick={handleClick}>
        CREDITS
      </Button>
      <Popover
        open={open}
        anchorEl={popoverAnchor}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className={globalClassName}
      >
        <AboutUsContents globalClassName={globalClassName} />
      </Popover>
    </div>
  );
};

const AboutUsContents = ({ globalClassName }: { globalClassName: string }) => {
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
  const openContactUsModal = () => setIsContactUsModalOpen(true);
  const closeContactUsModal = () => setIsContactUsModalOpen(false);

  return (
    <Box sx={{ padding: "24px", textAlign: "right" }} className="about-us-contents">
      <Box>
        <a
          href="/"
          style={{
            fontFamily: "Lobster, cursive",
            fontSize: "20px",
            color: "black",
          }}
        >
          Record Shop
        </a>
        <span style={{ fontSize: "16px" }}> by Devin B</span>
        <Typography style={{ fontSize: "12px" }}>Made in Victoria, BC</Typography>
      </Box>

      {/* TODO what's the url for this? */}
      <Box sx={{ marginTop: "12px" }}>
        <Button className="secondary-button" sx={{ width: "100%" }}>
          Buy me a Coffee {<ArrowOutwardIcon />}
        </Button>
      </Box>

      <Box sx={{ marginTop: "12px" }}>
        <Button className="primary-button" onClick={openContactUsModal} sx={{ width: "100%" }}>
          Contact Us
        </Button>
      </Box>

      <ContactUsModal
        isOpen={isContactUsModalOpen}
        closeModal={closeContactUsModal}
        globalClassName={globalClassName}
      />
    </Box>
  );
};
