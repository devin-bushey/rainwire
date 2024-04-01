import { Typography } from "@mui/material";

export const RecordShopTitle = ({ textColour = "black" }: { textColour?: string }) => (
  <Typography
    sx={{
      fontSize: "4rem",
      fontFamily: "Lobster, cursive",
      letterSpacing: "2px",
      color: textColour,
    }}
  >
    Record Shop
  </Typography>
);
