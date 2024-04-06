import { useEffect, useState } from "react";
import { GigCard } from "./GigCard";
import { COLOURS } from "../theme/AppStyles";
import { Gig } from "../types/Gig";
import { Grid, Container, Typography, Button } from "@mui/material";
import { Loading } from "../pages/Loading";

export const GigList = ({
  gigs,
  isQueryLoading,
  cardColours,
}: {
  gigs: Gig[] | undefined;
  isQueryLoading: boolean;
  cardColours?: string[];
}) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;
  const [displayedGigs, setDisplayedGigs] = useState<Gig[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const LOAD_INTERVAL = 10;

  useEffect(() => {
    setDisplayedGigs([]);
  }, [gigs]);

  const handleLoadMore = () => {
    const currentLength = displayedGigs.length;
    const nextGigs = gigs?.slice(currentLength, currentLength + LOAD_INTERVAL) || [];
    if (nextGigs.length < LOAD_INTERVAL) {
      setShowMore(false); // Hide the "Load More" button if there are no more gigs to load
    }
    setDisplayedGigs([...displayedGigs, ...nextGigs]);
  };

  if (isQueryLoading) {
    return <Loading />;
  }

  if (!gigs || gigs.length === 0) {
    return (
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "8px" }}>
          We couldn&#39;t find any upcoming events in your area.
        </Typography>
        <Typography sx={{ textAlign: "center", marginBottom: "8px" }}>Please select a different area.</Typography>
      </Container>
    );
  }

  // Display only the first 10 gigs initially
  if (displayedGigs.length === 0) {
    setDisplayedGigs(gigs.slice(0, LOAD_INTERVAL));
  }

  return (
    <>
      <Grid
        container
        justifyContent={{ xs: "center", sm: "space-between" }}
        rowSpacing={{ xs: 2, md: 3 }}
        columnSpacing={{ sm: 2, md: 3 }}
      >
        {displayedGigs.map((gig: Gig, index: number) => (
          <Grid item xs={12} sm={6} key={gig._id} display="flex" justifyContent="center">
            <GigCard gig={gig} bgcolor={colors[index % colors.length]} />
          </Grid>
        ))}
      </Grid>
      {showMore && (
        <Button variant="outlined" sx={{ marginTop: "32px" }} onClick={handleLoadMore}>
          Load More
        </Button>
      )}
    </>
  );
};
