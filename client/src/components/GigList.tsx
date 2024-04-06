import React, { useState } from "react";
import { GigCard } from "./GigCard";
import { COLOURS } from "../theme/AppStyles";
import { Gig } from "../types/Gig";
import { Error } from "./Error";
import { Grid, Button } from "@mui/material";
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
    return <Error />;
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
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {displayedGigs.map((gig: Gig, index: number) => (
          <Grid item xs={12} sm={6} key={gig._id} display="flex" justifyContent="center">
            <GigCard gig={gig} bgcolor={colors[index % colors.length]} />
          </Grid>
        ))}
      </Grid>
      {showMore && (
        <Button variant="outlined" onClick={handleLoadMore}>
          Load More
        </Button>
      )}
    </>
  );
};
