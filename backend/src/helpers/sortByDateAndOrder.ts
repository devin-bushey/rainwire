export const sortByDateAndOrder = (data: any) => {
  data.sort((a: any, b: any) => {
    // First, compare the dates
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      // If the dates are the same, compare the orders
      if (a.orderNum && b.orderNum) {
        if (a.orderNum < b.orderNum) {
          return -1;
        } else if (a.orderNum > b.orderNum) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (a.popularity < b.popularity) {
          return -1;
        } else if (a.popularity > b.popularity) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  });

  return data;
};
