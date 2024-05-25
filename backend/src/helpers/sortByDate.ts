export const sortByDate = (data: any) => {
  data.sort((a: any, b: any) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) {
      return -1;
    } else {
      return 1;
    }
  });

  return data;
};
