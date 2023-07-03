export const sortByPopularity = (tickets: any) => {
  tickets.sort((a: any, b: any) => {
    if (a.orderNum && b.orderNum) {
      return a.orderNum - b.orderNum;
    } else {
      return a.popularity - b.popularity;
    }
  });

  return tickets;
};
