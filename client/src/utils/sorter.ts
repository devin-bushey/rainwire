export const sortByOrderNum = (tickets: any) => {
  tickets.sort((a: any, b: any) => {
    return a.orderNum - b.orderNum;
  });

  return tickets;
};

export const sortDataByDateAndOrder = (data: any) => {
  data.sort((a: any, b: any) => {
    // First, compare the dates
    const dateA = new Date(a.day);
    const dateB = new Date(b.day);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      // If the dates are the same, compare the orders
      return a.orderNum - b.orderNum;
    }
  });

  return data;
};
