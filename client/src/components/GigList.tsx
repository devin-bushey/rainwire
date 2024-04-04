import { GigCard } from "./GigCard";
import { COLOURS } from "../theme/AppStyles";
import { Gig } from "../types/Gig";
import { Error } from "./Error";
import { Grid } from "@mui/material";
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

  if (isQueryLoading) {
    return <Loading />;
  }

  if (gigs?.length) {
    return (
      <Grid
        container
        justifyContent={{ xs: "center", sm: "space-between" }}
        rowSpacing={{ xs: 2, md: 3 }}
        columnSpacing={{ sm: 2, md: 3 }}
      >
        {gigs.map((gig: Gig, index: number) => (
          <Grid item xs={12} sm={6} key={gig._id} display="flex" justifyContent="center">
            <GigCard gig={gig} bgcolor={colors[index % colors.length]} />
          </Grid>
        ))}
      </Grid>
    );
  } else {
    return <Error />;
  }
};
