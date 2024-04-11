import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { goTo, scrollToTop } from "../utils/browserUtils";

export const FestivalPage = () => {
  useEffect(() => {
    document.title = "Record Shop | Festivals";
    scrollToTop();
  }, []);

  const festivalList = [
    { title: "Pachena Bay", endpoint: "pachenabay", colour: "#3B6AB3" },
    { title: "Phillips Backyard", endpoint: "phillipsbackyard", colour: "#F2C536" },
    { title: "Rifflandia", endpoint: "rifflandia", colour: "#f6edb5" },
  ];

  return (
    <>
      <Box sx={{ marginTop: "-24px", textAlign: "center", paddingBottom: "150px" }}>
        <Typography
          sx={{
            fontSize: "4rem",
            fontFamily: "Lobster, Arial, sans-serif",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Record Shop
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ maxWidth: "900px" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                paddingTop: "24px",
              }}
            >
              <Grid
                container
                justifyContent={{ xs: "center", sm: "space-between" }}
                rowSpacing={{ xs: 2, md: 3 }}
                columnSpacing={{ sm: 2, md: 3 }}
              >
                {festivalList.map((festival) => (
                  <FestivalCard
                    key={festival.endpoint}
                    title={festival.title}
                    endpoint={festival.endpoint}
                    colour={festival.colour}
                  />
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const FestivalCard = ({ endpoint, title, colour }: { endpoint: string; title: string; colour: string }) => (
  <Grid item xs={12} sm={6} display="flex" justifyContent="center">
    <Card
      sx={{
        backgroundColor: colour,
        maxWidth: "400px",
        width: "100%",
        alignItems: "center",
        cursor: "pointer",
        marginBottom: "0",
      }}
      onClick={() => goTo(`/${endpoint}`)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">{title}</Typography>
      </Box>
    </Card>
  </Grid>
);
