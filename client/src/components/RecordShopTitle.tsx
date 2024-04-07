import { Typography } from "@mui/material";
import { goTo } from "../utils/browserUtils";
import { Block } from "@mui/icons-material";

export const RecordShopTitle = ({ textColour = "black" }: { textColour?: string }) => (
  <Typography
    sx={{
      fontSize: "56px",
      fontFamily: "Lobster, cursive",
      letterSpacing: "2px",
      color: textColour,
      cursor: "pointer",
    }}
    onClick={() => goTo("/")}
  >
    Record Shop
  </Typography>
);
