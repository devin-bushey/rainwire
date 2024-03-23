import { Container, Typography } from "@mui/material";

export const JamBaseEmpty = () => {
  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "8px" }}>
        Search for a city to create a playlist!
      </Typography>
    </Container>
  );
};
