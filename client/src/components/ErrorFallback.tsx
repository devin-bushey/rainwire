import { Box, Container, Typography } from "@mui/material";

export const ErrorFallback = ({ error }: any) => {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", marginBottom: "8px" }}
        >
          Whoops! Something went wrong ...
        </Typography>
        <Typography sx={{ textAlign: "center", marginBottom: "8px" }}>
          Please contact recordshop.dev@gmail.com
        </Typography>
        <Typography>Error: ${error.message}</Typography>
      </Box>
    </Container>
  );
};
