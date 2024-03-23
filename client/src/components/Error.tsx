import { Container, Typography } from "@mui/material";

export const Error = () => {
  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "8px" }}>
        Whoops! Something went wrong ...
      </Typography>
      <Typography sx={{ textAlign: "center", marginBottom: "8px" }}>try refreshing the page (sorry)</Typography>
    </Container>
  );
};
